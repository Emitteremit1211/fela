
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("manage-admin-users", {
          body: {
            action: "request-password-reset",
            email: email.trim().toLowerCase(),
            redirectTo: `${window.location.origin}/admin/reset-password`,
          },
        });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setSuccess(true);
    } catch (err) {
      console.error("Password recovery request failed:", err);

      setError(
        "We couldn't process your request right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a77b45] mb-4">
            Fela Anikulapo-Kuti
          </p>

          <h1 className="font-serif text-4xl text-[#171717]">
            Exhibition Admin
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            Secure administrator account recovery.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-7 sm:p-9">
          <div className="w-11 h-11 bg-[#f5f1eb] flex items-center justify-center mb-5">
            <LockKeyhole size={19} className="text-[#a77b45]" />
          </div>

          {success ? (
            <>
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-green-50">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <h2 className="text-xl font-medium text-[#171717]">
                Check your email
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                If this address belongs to an eligible active
                administrator, password recovery instructions
                will be sent to it.
              </p>

              <p className="mt-3 break-all text-sm font-medium text-[#a77b45]">
                {email}
              </p>

              <Link
                to="/admin/login"
                className="mt-7 flex w-full items-center justify-center gap-3 bg-[#171717] py-3.5 text-sm text-white transition hover:bg-[#a77b45]"
              >
                Return to login
                <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-[#171717]">
                Forgot your password?
              </h2>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                Enter the email address associated with your
                administrator account. If eligible, you'll receive
                a password recovery link.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm text-gray-700">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your administrator email"
                      className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a77b45]"
                    />
                  </div>
                </div>

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
                      Processing...
                    </>
                  ) : (
                    <>
                      Send recovery link
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
