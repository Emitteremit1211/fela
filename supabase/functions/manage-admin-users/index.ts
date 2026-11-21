
import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashCode = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Resend error:", error);
    throw new Error("Unable to send email. Check your Resend sender settings.");
  }
}

function confirmationEmail(code: string, purpose: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222">
      <h2>Fela Retrospective Admin</h2>
      <p>Use the confirmation code below to ${escapeHtml(purpose)}.</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:20px;background:#f5f5f5;text-align:center">
        ${code}
      </div>
      <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
    const PROJECT_ANON_KEY = Deno.env.get("PROJECT_ANON_KEY")!;
    const PROJECT_SERVICE_ROLE_KEY = Deno.env.get("PROJECT_SERVICE_ROLE_KEY")!;
    const SITE_URL = Deno.env.get("SITE_URL")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL")!;

    if (
      !PROJECT_URL || !PROJECT_ANON_KEY || !PROJECT_SERVICE_ROLE_KEY ||
      !SITE_URL
    ) {
      throw new Error("Missing required Edge Function secrets.");
    }

    const adminClient = createClient(
      PROJECT_URL,
      PROJECT_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const body = await req.json();
    const { action } = body;

    // Password reset request is public, but only active admins receive email.
    if (action === "request-password-reset") {
      const email = normalizeEmail(body.email || "");

      if (!email || !email.includes("@")) {
        return json({ message: "If the account is eligible, a reset email will be sent." });
      }

      const { data: admin, error: lookupError } = await adminClient
        .from("admin_users")
        .select("id,email,is_active")
        .eq("email", email)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (admin?.is_active === true) {
        if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
          throw new Error("Email service is not configured.");
        }

        const { data: linkData, error: linkError } =
          await adminClient.auth.admin.generateLink({
            type: "recovery",
            email,
            options: {
              redirectTo: `${SITE_URL}/admin/reset-password`,
            },
          });

        if (linkError) throw linkError;

        const actionLink = linkData.properties?.action_link;
        if (!actionLink) throw new Error("Could not generate recovery link.");

        await sendEmail(
          RESEND_API_KEY,
          RESEND_FROM_EMAIL,
          email,
          "Reset your Fela Retrospective admin password",
          `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222">
              <h2>Fela Retrospective Admin</h2>
              <p>We received a request to reset your admin password.</p>
              <p><a href="${actionLink}" style="display:inline-block;padding:13px 22px;background:#111;color:#fff;text-decoration:none">Reset Password</a></p>
              <p>This link is for your account only. If you did not request it, ignore this email.</p>
            </div>
          `,
        );
      }

      return json({
        message: "If the account is eligible, a reset email will be sent.",
      });
    }

    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const token = authorization.replace("Bearer ", "");

    const authClient = createClient(PROJECT_URL, PROJECT_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } =
      await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return json({ error: "Invalid session" }, 401);
    }

    const caller = userData.user;

    const { data: callerAdmin, error: callerError } = await adminClient
      .from("admin_users")
      .select("id,email,role,is_active")
      .eq("id", caller.id)
      .maybeSingle();

    if (callerError) throw callerError;

    if (!callerAdmin || callerAdmin.is_active !== true) {
      return json({ error: "Your administrator access is inactive." }, 403);
    }

    // Superadmin-only actions.
    if (["list", "invite", "deactivate", "reactivate", "delete"].includes(action)) {
      if (callerAdmin.role !== "superadmin") {
        return json({ error: "Superadmin access required." }, 403);
      }
    }

    if (action === "list") {
      const { data, error } = await adminClient
        .from("admin_users")
        .select("id,email,role,created_at,is_active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return json({ users: data || [] });
    }

    if (action === "invite") {
      const email = normalizeEmail(body.email || "");

      if (!email || !email.includes("@")) {
        return json({ error: "Enter a valid email address." }, 400);
      }

      const { data: existing } = await adminClient
        .from("admin_users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) return json({ error: "This email is already an admin." }, 409);

      const { data: invited, error: inviteError } =
        await adminClient.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${SITE_URL}/admin/accept-invitation`,
        });

      if (inviteError) throw inviteError;
      if (!invited.user) throw new Error("Invitation could not be created.");

      const { error: insertError } = await adminClient
        .from("admin_users")
        .insert({
          id: invited.user.id,
          email,
          role: "admin",
          is_active: true,
        });

      if (insertError) {
        await adminClient.auth.admin.deleteUser(invited.user.id);
        throw insertError;
      }

      return json({ message: "Invitation sent successfully." });
    }

    if (action === "deactivate" || action === "reactivate") {
      const userId = body.userId;

      if (!userId || userId === caller.id) {
        return json({ error: "You cannot change your own access here." }, 400);
      }

      const { data: target, error: targetError } = await adminClient
        .from("admin_users")
        .select("id,role")
        .eq("id", userId)
        .maybeSingle();

      if (targetError) throw targetError;
      if (!target) return json({ error: "Administrator not found." }, 404);
      if (target.role === "superadmin") {
        return json({ error: "The superadmin account cannot be changed here." }, 403);
      }

      const { error } = await adminClient
        .from("admin_users")
        .update({ is_active: action === "reactivate" })
        .eq("id", userId);

      if (error) throw error;

      return json({
        message: action === "deactivate"
          ? "Administrator deactivated."
          : "Administrator reactivated.",
      });
    }

    if (action === "delete") {
      const userId = body.userId;

      if (!userId || userId === caller.id) {
        return json({ error: "You cannot delete your own account." }, 400);
      }

      const { data: target, error: targetError } = await adminClient
        .from("admin_users")
        .select("id,role")
        .eq("id", userId)
        .maybeSingle();

      if (targetError) throw targetError;
      if (!target) return json({ error: "Administrator not found." }, 404);
      if (target.role === "superadmin") {
        return json({ error: "The superadmin account cannot be deleted." }, 403);
      }

      const { error: deleteAuthError } =
        await adminClient.auth.admin.deleteUser(userId);

      if (deleteAuthError) throw deleteAuthError;

      const { error: deleteRowError } = await adminClient
        .from("admin_users")
        .delete()
        .eq("id", userId);

      if (deleteRowError) throw deleteRowError;

      return json({ message: "Administrator deleted." });
    }

    if (action === "request-email-change") {
      const newEmail = normalizeEmail(body.newEmail || "");

      if (!newEmail || !newEmail.includes("@")) {
        return json({ error: "Enter a valid new email address." }, 400);
      }

      if (newEmail === normalizeEmail(caller.email || "")) {
        return json({ error: "This is already your current email." }, 400);
      }

      const { data: existing } = await adminClient
        .from("admin_users")
        .select("id")
        .eq("email", newEmail)
        .maybeSingle();

      if (existing) return json({ error: "This email is already assigned to an admin." }, 409);

      if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
        throw new Error("Email service is not configured.");
      }

      const code = generateCode();
      const codeHash = await hashCode(`${caller.id}:${code}`);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: saveError } = await adminClient
        .from("admin_email_change_requests")
        .upsert({
          user_id: caller.id,
          new_email: newEmail,
          code_hash: codeHash,
          expires_at: expiresAt,
          attempts: 0,
        });

      if (saveError) throw saveError;

      await sendEmail(
        RESEND_API_KEY,
        RESEND_FROM_EMAIL,
        caller.email!,
        "Confirm your email address change",
        confirmationEmail(code, `change your admin email to ${newEmail}`),
      );

      return json({ message: "A confirmation code has been sent to your current email." });
    }

    if (action === "confirm-email-change") {
      const code = String(body.code || "").trim();

      if (!/^\d{6}$/.test(code)) {
        return json({ error: "Enter the six-digit confirmation code." }, 400);
      }

      const { data: request, error: requestError } = await adminClient
        .from("admin_email_change_requests")
        .select("*")
        .eq("user_id", caller.id)
        .maybeSingle();

      if (requestError) throw requestError;
      if (!request) return json({ error: "No email change request was found." }, 404);

      if (new Date(request.expires_at).getTime() < Date.now()) {
        await adminClient.from("admin_email_change_requests").delete().eq("user_id", caller.id);
        return json({ error: "The confirmation code has expired. Request another." }, 400);
      }

      if (request.attempts >= 5) {
        return json({ error: "Too many attempts. Request a new code." }, 429);
      }

      const submittedHash = await hashCode(`${caller.id}:${code}`);

      if (submittedHash !== request.code_hash) {
        await adminClient
          .from("admin_email_change_requests")
          .update({ attempts: request.attempts + 1 })
          .eq("user_id", caller.id);

        return json({ error: "The confirmation code is incorrect." }, 400);
      }

      const newEmail = request.new_email;

      const { error: authUpdateError } =
        await adminClient.auth.admin.updateUserById(caller.id, {
          email: newEmail,
          email_confirm: true,
        });

      if (authUpdateError) throw authUpdateError;

      const { error: rowUpdateError } = await adminClient
        .from("admin_users")
        .update({ email: newEmail })
        .eq("id", caller.id);

      if (rowUpdateError) throw rowUpdateError;

      await adminClient
        .from("admin_email_change_requests")
        .delete()
        .eq("user_id", caller.id);

      return json({ message: "Your email address has been updated." });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error("manage-admin-users error:", error);
    return json({
      error: error instanceof Error ? error.message : "Unexpected server error.",
    }, 500);
  }
});
