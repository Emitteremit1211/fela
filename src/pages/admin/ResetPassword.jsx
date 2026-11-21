
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [validRecovery, setValidRecovery] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyActiveAdmin = async (session) => {
    if (!session?.user?.id) {
      throw new Error("Your recovery session is invalid or has expired.");
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("id, is_active")
      .eq("id", session.user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Admin verification error:", adminError);
      throw new Error(
        "Unable to verify administrator access. Please try again."
      );
    }

    if (!admin || admin.is_active !== true) {
      throw new Error(
        "This administrator account is inactive or no longer authorised to access the dashboard."
      );
    }

    return true;
  };

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace(/^#/, ""));

        const isRecoveryLink =
          params.get("type") === "recovery";

        if (!isRecoveryLink) {
          throw new Error(
            "This is not a valid password recovery link. Please request another."
          );
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error(
            "Your recovery link is invalid or has expired. Please request another."
          );
        }

        await verifyActiveAdmin(session);

        if (!mounted) return;

        setValidRecovery(true);
        setError("");
      } catch (err) {
        console.error("Recovery verification failed:", err);

        if (!mounted) return;

        setValidRecovery(false);
        setError(err.message || "Unable to verify your recovery link.");

        await supabase.auth.signOut();
      } finally {
        if (mounted) setChecking(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" && session) {
        // The recovery session will be checked by checkRecoverySession.
      }
    });

    checkRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
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
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        throw new Error(
          "Your recovery session has expired. Please request another recovery link."
        );
      }

      // Recheck account status immediately before changing the password.
      await verifyActiveAdmin(session);

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();
    } catch (err) {
      console.error("Password reset failed:", err);

      setError(
        err.message ||
          "Unable to update your password. Please request a new recovery link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#a77b45]">
            Fela Anikulapo-Kuti
          </p>

          <h1 className="font-serif text-4xl text-[#171717]">
            Exhibition Admin
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Secure administrator account recovery.
          </p>
        </div>

        <div className="border border-gray-200 bg-white p-7 sm:p-9">
          {checking ? (
            <div className="py-10 text-center">
              <Loader2
                size={25}
                className="mx-auto animate-spin text-[#a77b45]"
              />

              <p className="mt-4 text-sm text-gray-500">
                Verifying your recovery link and administrator access...
              </p>
            </div>
          ) : success ? (
            <>
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-green-50">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <h2 className="text-xl font-medium text-[#171717]">
                Password updated
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Your administrator password has been changed successfully.
                You can now sign in using your new password.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/login", { replace: true })}
                className="mt-7 flex w-full items-center justify-center gap-3 bg-[#171717] py-3.5 text-sm text-white transition hover:bg-[#a77b45]"
              >
                Go to administrator login
                <ArrowRight size={17} />
              </button>
            </>
          ) : !validRecovery ? (
            <>
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-red-50">
                <LockKeyhole size={19} className="text-red-500" />
              </div>

              <h2 className="text-xl font-medium text-[#171717]">
                {error.includes("inactive") || error.includes("authorised")
                  ? "Administrator access unavailable"
                  : "Invalid or expired link"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {error ||
                  "This password recovery link is invalid or has expired. Request a new recovery email to continue."}
              </p>

              <Link
                to="/admin/forgot-password"
                className="mt-7 flex w-full items-center justify-center gap-3 bg-[#171717] py-3.5 text-sm text-white transition hover:bg-[#a77b45]"
              >
                Request another link
                <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#f5f1eb]">
                <LockKeyhole size={19} className="text-[#a77b45]" />
              </div>

              <h2 className="text-xl font-medium text-[#171717]">
                Create a new password
              </h2>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                Choose a strong password for your administrator account.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-gray-700">
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm outline-none focus:border-[#a77b45]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a77b45]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-700">
                    Confirm new password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter your password again"
                      className="w-full border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm outline-none focus:border-[#a77b45]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a77b45]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  Use at least 8 characters.
                </p>

                {error && (
                  <div
                    role="alert"
                    className="border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 bg-[#171717] py-3.5 text-sm text-white transition hover:bg-[#a77b45] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Update password
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-7 border-t border-gray-100 pt-5">
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-[#a77b45]"
            >
              <ArrowLeft size={15} />
              Back to administrator login
            </Link>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          Fela Anikulapo-Kuti: A Retrospective · 2026
        </p>
      </div>
    </div>
  );
}
