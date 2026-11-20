
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function AcceptInvitation() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    const checkInvitation = async () => {
      const params = new URLSearchParams(window.location.search);
      const invitationError =
        params.get("error_description") || params.get("error");

      if (invitationError) {
        if (active) {
          setError(
            "This invitation link is invalid or has expired. Please ask the Superadmin to send another invitation."
          );
          setChecking(false);
        }
        return;
      }

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!active) return;

      if (sessionError || !data.session) {
        setError(
          "We could not verify your invitation. Please open the latest invitation link sent to your email."
        );
        setValidSession(false);
      } else {
        setValidSession(true);
      }

      setChecking(false);
    };

    checkInvitation();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 1800);
    } catch (err) {
      console.error("Password setup failed:", err);
      setError(
        err.message || "Unable to create your password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={19} className="animate-spin" />
          Verifying your invitation...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#a77b45]">
            Fela Anikulapo-Kuti
          </p>
          <h1 className="font-serif text-4xl text-[#171717]">
            Complete your account
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Set a password to access the exhibition administration panel.
          </p>
        </div>

        <div className="border border-gray-200 bg-white p-7 sm:p-9">
          {success ? (
            <div className="py-5 text-center">
              <CheckCircle2
                size={42}
                className="mx-auto text-green-600"
              />
              <h2 className="mt-5 font-serif text-2xl">
                Account setup complete
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your password has been created. Taking you to the login page...
              </p>
            </div>
          ) : !validSession ? (
            <div className="py-4 text-center">
              <AlertCircle
                size={35}
                className="mx-auto text-red-500"
              />
              <h2 className="mt-4 font-serif text-xl">
                Invitation unavailable
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="mt-6 bg-[#171717] px-6 py-3 text-xs text-white hover:bg-[#a77b45]"
              >
                Go to login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#f5f1eb]">
                  <LockKeyhole size={19} className="text-[#a77b45]" />
                </div>
                <h2 className="text-xl font-medium text-[#171717]">
                  Create your password
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Choose a secure password. You will use it with your invited
                  email address to sign in.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-700">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password again"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 bg-[#171717] py-3.5 text-sm text-white transition hover:bg-[#a77b45] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating password...
                    </>
                  ) : (
                    "Confirm password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          Fela Anikulapo-Kuti: A Retrospective · 2026
        </p>
      </div>
    </div>
  );
}
