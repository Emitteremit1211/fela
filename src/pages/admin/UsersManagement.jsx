
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
  Pencil,
  Power,
  PowerOff,
  LockKeyhole,
  CalendarDays,
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

  const [processingId, setProcessingId] = useState("");

  const [emailChangeUser, setEmailChangeUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [emailStep, setEmailStep] = useState("request");

  const [showEmailModal, setShowEmailModal] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const getErrorMessage = (err) => {
    return (
      err?.message ||
      err?.error_description ||
      "Something went wrong. Please try again."
    );
  };

  const invokeAction = async (payload) => {
    const { data, error: functionError } =
      await supabase.functions.invoke("manage-admin-users", {
        body: payload,
      });

    if (functionError) throw functionError;
    if (data?.error) throw new Error(data.error);

    return data;
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await invokeAction({ action: "list" });
      setUsers(data?.users || []);
    } catch (err) {
      console.error("Unable to load administrators:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // INVITE ADMINISTRATOR
  const handleInvite = async (e) => {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter an email address.");
      return;
    }

    setSubmitting(true);

    try {
      await invokeAction({
        action: "invite",
        email: cleanEmail,
      });

      setSuccess(`Invitation sent successfully to ${cleanEmail}.`);
      setEmail("");
      setShowInvite(false);

      await loadUsers();
    } catch (err) {
      console.error("Invitation failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // REQUEST EMAIL CHANGE
  const openEmailEditor = (user) => {
    clearMessages();
    setEmailChangeUser(user);
    setNewEmail(user.email || "");
    setConfirmationCode("");
    setEmailStep("request");
    setShowEmailModal(true);
  };

  const closeEmailEditor = () => {
    if (submitting) return;

    setShowEmailModal(false);
    setEmailChangeUser(null);
    setNewEmail("");
    setConfirmationCode("");
    setEmailStep("request");
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!emailChangeUser) return;

    const cleanEmail = newEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Enter the new email address.");
      return;
    }

    if (cleanEmail === emailChangeUser.email.toLowerCase()) {
      setError("The new email is the same as the current email.");
      return;
    }

    setSubmitting(true);

    try {
      await invokeAction({
        action: "request-email-change",
        userId: emailChangeUser.id,
        newEmail: cleanEmail,
      });

      setEmailStep("confirm");
      setSuccess(
        `A six-digit confirmation code has been sent to ${emailChangeUser.email}.`
      );
    } catch (err) {
      console.error("Email change request failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // CONFIRM EMAIL CHANGE
  const handleConfirmEmailChange = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!emailChangeUser) return;

    if (!/^\d{6}$/.test(confirmationCode.trim())) {
      setError("Enter the six-digit confirmation code.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await invokeAction({
        action: "confirm-email-change",
        userId: emailChangeUser.id,
        code: confirmationCode.trim(),
      });

      setSuccess(
        data?.message || "Administrator email updated successfully."
      );

      setShowEmailModal(false);
      setEmailChangeUser(null);
      setNewEmail("");
      setConfirmationCode("");
      setEmailStep("request");

      await loadUsers();
    } catch (err) {
      console.error("Email confirmation failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // DEACTIVATE / REACTIVATE
  const handleStatusChange = async (user) => {
    const currentlyActive = user.is_active !== false;

    const action = currentlyActive ? "deactivate" : "reactivate";

    const confirmed = window.confirm(
      currentlyActive
        ? `Deactivate ${user.email}?\n\nThis administrator will lose access to the exhibition dashboard. You can reactivate the account later.`
        : `Reactivate ${user.email}?\n\nThis administrator will regain access to the exhibition dashboard.`
    );

    if (!confirmed) return;

    clearMessages();
    setProcessingId(user.id);

    try {
      const data = await invokeAction({
        action,
        userId: user.id,
      });

      setSuccess(
        data?.message ||
          (action === "deactivate"
            ? "Administrator deactivated."
            : "Administrator reactivated.")
      );

      await loadUsers();
    } catch (err) {
      console.error("Administrator status update failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setProcessingId("");
    }
  };

  // DELETE ADMINISTRATOR
  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Permanently delete ${user.email}?\n\nThis will remove their administrator record and authentication account. This action cannot be undone.`
    );

    if (!confirmed) return;

    clearMessages();
    setProcessingId(user.id);

    try {
      const data = await invokeAction({
        action: "delete",
        userId: user.id,
      });

      setSuccess(data?.message || `${user.email} has been removed.`);

      await loadUsers();
    } catch (err) {
      console.error("Administrator deletion failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setProcessingId("");
    }
  };

  const totalActive = users.filter(
    (user) => user.is_active !== false
  ).length;

  const totalInactive = users.filter(
    (user) => user.is_active === false
  ).length;

  const totalSuperadmins = users.filter(
    (user) => user.role === "superadmin"
  ).length;

  return (
    <div>
      {/* PAGE HEADER */}
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
            Manage administrator accounts, access permissions and
            account status for the exhibition dashboard.
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
              clearMessages();
              setShowInvite(true);
            }}
            className="flex items-center gap-2 bg-[#171717] px-4 py-3 text-xs text-white transition hover:bg-[#a77b45]"
          >
            <UserPlus size={16} />
            Add administrator
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="break-words">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p className="break-words">{success}</p>
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Total administrators
            </p>
            <Users size={19} className="text-[#a77b45]" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading ? "—" : users.length}
          </p>
        </div>

        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active accounts</p>
            <Power size={19} className="text-green-600" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading ? "—" : totalActive}
          </p>
        </div>

        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Deactivated</p>
            <PowerOff size={19} className="text-red-500" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading ? "—" : totalInactive}
          </p>
        </div>

        <div className="border border-[#e9e6e0] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Superadmins</p>
            <ShieldCheck size={19} className="text-[#a77b45]" />
          </div>
          <p className="mt-5 font-serif text-4xl">
            {loading ? "—" : totalSuperadmins}
          </p>
        </div>
      </div>

      {/* ADMINISTRATOR TABLE */}
      <div className="overflow-hidden border border-[#e9e6e0] bg-white">
        <div className="border-b border-[#eeeae4] px-5 py-5 sm:px-7">
          <h2 className="font-serif text-xl">
            All administrator accounts
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Manage administrator access and account information.
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
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#faf9f7]">
                <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4 font-medium">
                    Administrator
                  </th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">
                    Date added
                  </th>
                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => {
                  const isSuperadmin = item.role === "superadmin";
                  const isActive = item.is_active !== false;
                  const isProcessing = processingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-[#eeeae4] transition hover:bg-[#fdfcfb]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f1eb] text-sm font-medium text-[#a77b45]">
                            {item.email?.charAt(0)?.toUpperCase() || "A"}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-[#222]">
                              {item.email}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-400">
                              {isSuperadmin
                                ? "Full system access"
                                : "Administrator access"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] ${
                            isSuperadmin
                              ? "bg-[#f5f1eb] text-[#9b713e]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isSuperadmin && <ShieldCheck size={13} />}
                          {isSuperadmin ? "Superadmin" : "Admin"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] ${
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-green-600" : "bg-red-500"
                            }`}
                          />
                          {isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays
                            size={13}
                            className="text-gray-400"
                          />
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {/* EMAIL EDIT IS AVAILABLE FOR SUPERADMIN TOO */}
                          <button
                            type="button"
                            title="Change email"
                            onClick={() => openEmailEditor(item)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-2 border border-[#e8e4dd] px-3 py-2 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45] disabled:opacity-50"
                          >
                            <Pencil size={13} />
                            <span>Edit email</span>
                          </button>

                          {!isSuperadmin && (
                            <>
                              <button
                                type="button"
                                title={
                                  isActive
                                    ? "Deactivate administrator"
                                    : "Reactivate administrator"
                                }
                                onClick={() =>
                                  handleStatusChange(item)
                                }
                                disabled={isProcessing}
                                className={`inline-flex items-center gap-2 border px-3 py-2 text-xs transition disabled:opacity-50 ${
                                  isActive
                                    ? "border-orange-100 text-orange-700 hover:bg-orange-50"
                                    : "border-green-100 text-green-700 hover:bg-green-50"
                                }`}
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : isActive ? (
                                  <PowerOff size={13} />
                                ) : (
                                  <Power size={13} />
                                )}
                                <span>
                                  {isActive ? "Deactivate" : "Reactivate"}
                                </span>
                              </button>

                              <button
                                type="button"
                                title="Permanently delete administrator"
                                onClick={() => handleDelete(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-2 border border-red-100 px-3 py-2 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INVITE MODAL */}
      {showInvite && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div className="my-auto w-full max-w-md bg-white p-6 shadow-xl sm:p-8">
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
                onClick={() => !submitting && setShowInvite(false)}
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
                cannot invite or remove other administrators.
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

      {/* EMAIL CHANGE MODAL */}
      {showEmailModal && emailChangeUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8">
          <div className="my-auto w-full max-w-md bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a77b45]">
                  Account management
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  {emailStep === "request"
                    ? "Change email address"
                    : "Confirm email change"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEmailEditor}
                disabled={submitting}
                className="text-gray-400 hover:text-black disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {emailStep === "request" ? (
              <form
                onSubmit={handleRequestEmailChange}
                className="space-y-5"
              >
                <div className="border border-[#eeeae4] bg-[#faf9f7] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">
                    Current administrator
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-[#222]">
                    {emailChangeUser.email}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-600">
                    New email address
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
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="newemail@example.com"
                      className="w-full border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a77b45]"
                    />
                  </div>
                </div>

                <div className="border border-[#eeeae4] bg-[#faf9f7] p-4 text-xs leading-6 text-gray-500">
                  A six-digit confirmation code will be sent to the
                  administrator's current email address. The email
                  will only change after the code is verified.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEmailEditor}
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
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Sending code...
                      </>
                    ) : (
                      <>
                        <Mail size={15} />
                        Send confirmation code
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleConfirmEmailChange}
                className="space-y-5"
              >
                <div className="border border-[#eeeae4] bg-[#faf9f7] p-4 text-xs leading-6 text-gray-500">
                  A confirmation code has been sent to:
                  <p className="mt-1 break-all font-medium text-[#222]">
                    {emailChangeUser.email}
                  </p>

                  <p className="mt-3">
                    New email address:
                  </p>
                  <p className="break-all font-medium text-[#a77b45]">
                    {newEmail}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-600">
                    Six-digit confirmation code
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      value={confirmationCode}
                      onChange={(e) =>
                        setConfirmationCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="000000"
                      className="w-full border border-gray-200 py-3 pl-11 pr-4 text-center text-lg tracking-[0.35em] outline-none focus:border-[#a77b45]"
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-gray-400">
                    The code expires after 10 minutes.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailStep("request");
                      setConfirmationCode("");
                      clearMessages();
                    }}
                    disabled={submitting}
                    className="flex-1 border border-gray-200 py-3 text-xs text-gray-600"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || confirmationCode.length !== 6}
                    className="flex flex-1 items-center justify-center gap-2 bg-[#171717] py-3 text-xs text-white hover:bg-[#a77b45] disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        Confirm change
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
