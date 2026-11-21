
import { useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const {
    login,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    location.state?.message || ""
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <p className="text-sm text-gray-500">
          Checking administrator access...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);

      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin login failed:", err);

      setError(
        err.message || "Unable to sign in. Please try again."
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
            Sign in to manage the retrospective exhibition website.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-7 sm:p-9">
          <div className="mb-7">
            <div className="w-11 h-11 bg-[#f5f1eb] flex items-center justify-center mb-5">
              <LockKeyhole
                size={19}
                className="text-[#a77b45]"
              />
            </div>

            <h2 className="text-xl font-medium text-[#171717]">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter your administrator credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
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
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a77b45]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-gray-700">
                  Password
                </label>

                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-[#a77b45] transition hover:text-[#171717]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              className="w-full bg-[#171717] text-white py-3.5 flex items-center justify-center gap-3 text-sm hover:bg-[#a77b45] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Verifying account...
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-7">
          Fela Anikulapo-Kuti: A Retrospective · 2026
        </p>
      </div>
    </div>
  );
}
