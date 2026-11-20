
import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Trash2,
  Mail,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function UsersManagement({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("manage-admin-users", {
          body: { action: "list" },
        });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setUsers(data?.users || []);
    } catch (err) {
      console.error("Unable to load administrators:", err);
      setError(err.message || "Unable to load administrator accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter an email address.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("manage-admin-users", {
          body: {
            action: "invite",
            email: cleanEmail,
          },
        });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setSuccess(
        `Invitation sent successfully to ${cleanEmail}.`
      );
      setEmail("");
      setShowInvite(false);
      await loadUsers();
    } catch (err) {
      console.error("Invitation failed:", err);
      setError(err.message || "Unable to invite this administrator.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Remove administrator access for ${user.email}? This will delete their admin account and authentication account.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(user.id);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("manage-admin-users", {
          body: {
            action: "delete",
            userId: user.id,
          },
        });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setSuccess(`${user.email} has been removed.`);
      await loadUsers();
    } catch (err) {
      console.error("Administrator removal failed:", err);
      setError(err.message || "Unable to remove this administrator.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 text-xs text-gray-500 hover:text-[#a77b45]"
          >
            ← Back to overview
          </button>

          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#a77b45]">
            Access control
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl">
            Administrator users
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Invite and manage the people who can access the exhibition
            administration panel.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center gap-2 border border-[#e8e4dd] bg-white px-4 py-3 text-xs text-gray-600 hover:border-[#a77b45] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setShowInvite(true);
              setError("");
              setSuccess("");
            }}
            className="flex items-center gap-2 bg-[#171717] px-4 py-3 text-xs text-white transition hover:bg-[#a77b45]"
          >
            <UserPlus size={16} />
            Add administrator
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="break-words">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total administrators</p>
            <Users size={19} className="text-[#a77b45]" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading ? "—" : users.length}
          </p>
        </div>

        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Superadmins</p>
            <ShieldCheck size={19} className="text-[#a77b45]" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading
              ? "—"
              : users.filter((item) => item.role === "superadmin").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden border border-[#e9e6e0] bg-white">
        <div className="border-b border-[#eeeae4] px-5 py-5 sm:px-7">
          <h2 className="font-serif text-xl">All administrator accounts</h2>
          <p className="mt-1 text-xs text-gray-400">
            Only the Superadmin can manage these accounts.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            Loading administrator accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={28} className="mx-auto text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              No administrator accounts found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#faf9f7]">
                <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4 font-medium">Administrator</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Date added</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#eeeae4]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1eb] text-sm text-[#a77b45]">
                          {item.email?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#222]">
                            {item.email}
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            {item.role === "superadmin"
                              ? "Full system access"
                              : "Administrator access"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] ${
                          item.role === "superadmin"
                            ? "bg-[#f5f1eb] text-[#9b713e]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.role === "superadmin" && (
                          <ShieldCheck size={13} />
                        )}
                        {item.role === "superadmin"
                          ? "Superadmin"
                          : "Admin"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-xs text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-5 text-right">
                      {item.role === "superadmin" ? (
                        <span className="text-xs text-gray-400">
                          Protected
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-2 border border-red-100 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-md bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a77b45]">
                  New account
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  Add administrator
                </h2>
                <p className="mt-2 text-xs leading-6 text-gray-500">
                  An invitation email will be sent so the person can
                  complete their account setup.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="text-gray-400 hover:text-black"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs text-gray-600">
                  Administrator email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a77b45]"
                  />
                </div>
              </div>

              <div className="border border-[#eeeae4] bg-[#faf9f7] p-4 text-xs leading-6 text-gray-500">
                New accounts receive the standard Admin role. They
                cannot add or remove other administrators or change
                their own role.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  disabled={submitting}
                  className="flex-1 border border-gray-200 py-3 text-xs text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 bg-[#171717] py-3 text-xs text-white hover:bg-[#a77b45] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Send invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
