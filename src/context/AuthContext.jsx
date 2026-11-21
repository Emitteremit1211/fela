
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminActive, setAdminActive] = useState(false);
  const [accessError, setAccessError] = useState("");

  // Get the current session and listen for authentication changes.
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
        setAccessError("Unable to verify your session. Please sign in again.");
      }

      setSession(data?.session ?? null);
      setLoading(false);
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setLoading(false);

      if (!newSession) {
        setAdminActive(false);
        setAccessError("");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Verify that the authenticated user is an active administrator.
  useEffect(() => {
    let cancelled = false;

    const verifyAdministrator = async () => {
      if (!session?.user?.id) {
        setAdminActive(false);
        return;
      }

      setAdminActive(false);
      setAccessError("");

      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("id, role, is_active")
          .eq("id", session.user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Administrator verification failed:", error);

          setAccessError(
            "We could not verify your administrator access. Please sign in again."
          );

          await supabase.auth.signOut();
          return;
        }

        if (!data || data.is_active !== true) {
          setAccessError(
            "Your administrator account is inactive or does not have dashboard access."
          );

          await supabase.auth.signOut();
          return;
        }

        setAdminActive(true);
      } catch (error) {
        if (cancelled) return;

        console.error("Administrator verification error:", error);

        setAccessError(
          "Unable to verify administrator access. Please sign in again."
        );

        await supabase.auth.signOut();
      }
    };

    verifyAdministrator();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  // Login and verify administrator status before granting access.
  const login = async (email, password) => {
    setAccessError("");
    setAdminActive(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;

    const userId = data?.user?.id;

    if (!userId) {
      await supabase.auth.signOut();
      throw new Error("Unable to verify your account. Please try again.");
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("id, role, is_active")
      .eq("id", userId)
      .maybeSingle();

    if (adminError) {
      console.error("Administrator login verification failed:", adminError);

      await supabase.auth.signOut();

      throw new Error(
        "Unable to verify administrator access. Please try again."
      );
    }

    if (!admin || admin.is_active !== true) {
      await supabase.auth.signOut();

      throw new Error(
        "Your account does not have active administrator access. Please contact the superadmin."
      );
    }

    setAdminActive(true);

    return data;
  };

  // Logout.
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setSession(null);
    setAdminActive(false);
    setAccessError("");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        adminActive,
        accessError,
        login,
        logout,
        isAuthenticated: !!session && adminActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
