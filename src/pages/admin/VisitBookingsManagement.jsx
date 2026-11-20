
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(value) {
  if (!value) return "Not provided";

  return new Date(`${value}T12:00:00`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        STATUS_STYLES[status] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#a77b45]" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <div className="mt-1 break-words text-sm text-gray-800">
          {children || "Not provided"}
        </div>
      </div>
    </div>
  );
}

export default function VisitBookingsManagement({ onBack, onStatsChange }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadBookings = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("visit_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      const rows = data || [];
      setBookings(rows);

      onStatsChange?.({
        total: rows.length,
        pending: rows.filter((item) => item.status === "Pending").length,
        approved: rows.filter((item) => item.status === "Approved").length,
        rejected: rows.filter((item) => item.status === "Rejected").length,
      });
    } catch (err) {
      console.error("Unable to load visit bookings:", err);
      setError(
        err?.message ||
          "Unable to load visit bookings. Please refresh and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [onStatsChange]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((item) => item.status === "Pending").length,
    Approved: bookings.filter((item) => item.status === "Approved").length,
    Rejected: bookings.filter((item) => item.status === "Rejected").length,
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter =
      activeFilter === "All" || booking.status === activeFilter;

    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [
        booking.full_name,
        booking.email,
        booking.phone,
        booking.organisation,
        booking.visitor_type,
      ].some((value) => String(value || "").toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (booking, nextStatus) => {
    if (!booking?.id || booking.status === nextStatus) return;

    setUpdatingId(booking.id);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("visit_bookings")
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setBookings((previous) =>
        previous.map((item) => (item.id === booking.id ? data : item))
      );
      setSelectedBooking(data);

      const updatedRows = bookings.map((item) =>
        item.id === booking.id ? data : item
      );

      onStatsChange?.({
        total: updatedRows.length,
        pending: updatedRows.filter((item) => item.status === "Pending").length,
        approved: updatedRows.filter((item) => item.status === "Approved").length,
        rejected: updatedRows.filter((item) => item.status === "Rejected").length,
      });
    } catch (err) {
      console.error("Unable to update booking:", err);
      setError(err?.message || "The booking status could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteBooking = async (booking) => {
    if (!booking?.id) return;

    const confirmed = window.confirm(
      `Delete the booking from ${booking.full_name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(booking.id);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("visit_bookings")
        .delete()
        .eq("id", booking.id);

      if (deleteError) throw deleteError;

      const remaining = bookings.filter((item) => item.id !== booking.id);
      setBookings(remaining);

      if (selectedBooking?.id === booking.id) {
        setSelectedBooking(null);
      }

      onStatsChange?.({
        total: remaining.length,
        pending: remaining.filter((item) => item.status === "Pending").length,
        approved: remaining.filter((item) => item.status === "Approved").length,
        rejected: remaining.filter((item) => item.status === "Rejected").length,
      });
    } catch (err) {
      console.error("Unable to delete booking:", err);
      setError(err?.message || "The booking could not be deleted.");
    } finally {
      setDeletingId("");
    }
  };

  const exportBookings = () => {
    const headers = [
      "Visitor Type",
      "Full Name",
      "Email",
      "Phone",
      "Preferred Date",
      "Visitor Count",
      "Organisation",
      "Contact Role",
      "Notes",
      "Status",
      "Submitted At",
    ];

    const rows = filteredBookings.map((item) => [
      item.visitor_type,
      item.full_name,
      item.email,
      item.phone,
      item.preferred_date,
      item.visitor_count,
      item.organisation,
      item.contact_role,
      item.notes,
      item.status,
      item.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "fela-visit-bookings.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    { label: "Total bookings", value: counts.All, icon: Users },
    { label: "Pending review", value: counts.Pending, icon: Clock3 },
    { label: "Approved", value: counts.Approved, icon: CheckCircle2 },
    { label: "Rejected", value: counts.Rejected, icon: XCircle },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={15} />
            Back to overview
          </button>

          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#a77b45]">
            Visitor management
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">
            Visit bookings
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Review visitor requests, manage booking statuses and view the
            details submitted through the public website.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadBookings(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 border border-[#e8e4dd] bg-white px-4 py-3 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportBookings}
            disabled={!filteredBookings.length}
            className="inline-flex items-center gap-2 bg-[#191919] px-4 py-3 text-xs text-white transition hover:bg-[#a77b45] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
          <p className="break-words">{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="border border-[#e9e6e0] bg-white p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{card.label}</p>
                <Icon size={18} className="text-[#a77b45]" />
              </div>
              <p className="mt-5 font-serif text-3xl">
                {loading ? "—" : card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border border-[#e9e6e0] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#eeeae4] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`border px-4 py-2 text-xs transition ${
                  activeFilter === filter
                    ? "border-[#191919] bg-[#191919] text-white"
                    : "border-[#e8e4dd] text-gray-500 hover:border-[#a77b45] hover:text-[#a77b45]"
                }`}
              >
                {filter}
                <span className="ml-2 opacity-70">{counts[filter]}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-[300px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full border border-[#e8e4dd] py-3 pl-10 pr-3 text-xs outline-none transition focus:border-[#a77b45]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center gap-3 text-sm text-gray-400">
            <Loader2 size={19} className="animate-spin" />
            Loading visit bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
              <CalendarDays size={23} />
            </div>
            <h3 className="font-serif text-2xl">No bookings found</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {search || activeFilter !== "All"
                ? "Try another search term or status filter."
                : "New visitor booking requests submitted through the website will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#faf9f7]">
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-semibold">Visitor</th>
                    <th className="px-6 py-4 font-semibold">Visit date</th>
                    <th className="px-6 py-4 font-semibold">Visitors</th>
                    <th className="px-6 py-4 font-semibold">Submitted</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeae4]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#fcfbf9]">
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.full_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {booking.email}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[#a77b45]">
                          {booking.visitor_type} visit
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {formatDate(booking.preferred_date)}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {booking.visitor_count}
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-500">
                        {formatDateTime(booking.created_at)}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-2 border border-[#e8e4dd] px-3 py-2 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45]"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#eeeae4] md:hidden">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {booking.full_name}
                      </p>
                      <p className="mt-1 break-all text-xs text-gray-400">
                        {booking.email}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span>{formatDate(booking.preferred_date)}</span>
                    <span>{booking.visitor_count} visitor(s)</span>
                    <span>{booking.visitor_type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-4 inline-flex items-center gap-2 border border-[#e8e4dd] px-3 py-2 text-xs text-gray-600"
                  >
                    <Eye size={14} />
                    View booking
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="border-t border-[#eeeae4] px-5 py-4 text-xs text-gray-400 sm:px-6">
            Showing {filteredBookings.length} of {bookings.length} booking(s)
          </div>
        )}
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBooking(null);
            }
          }}
        >
          <div className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between border-b border-[#eeeae4] bg-white px-6 py-5 sm:px-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a77b45]">
                  Booking details
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  {selectedBooking.full_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 transition hover:text-gray-900"
                aria-label="Close booking details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-7 px-6 py-7 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={selectedBooking.status} />
                <span className="text-xs text-gray-400">
                  Submitted {formatDateTime(selectedBooking.created_at)}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <DetailRow icon={Users} label="Visitor type">
                  {selectedBooking.visitor_type}
                </DetailRow>
                <DetailRow icon={Users} label="Number of visitors">
                  {selectedBooking.visitor_count}
                </DetailRow>
                <DetailRow icon={Mail} label="Email address">
                  <a
                    href={`mailto:${selectedBooking.email}`}
                    className="text-[#a77b45] hover:underline"
                  >
                    {selectedBooking.email}
                  </a>
                </DetailRow>
                <DetailRow icon={Phone} label="Phone number">
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="text-[#a77b45] hover:underline"
                  >
                    {selectedBooking.phone}
                  </a>
                </DetailRow>
                <DetailRow icon={CalendarDays} label="Preferred visit date">
                  {formatDate(selectedBooking.preferred_date)}
                </DetailRow>
                <DetailRow icon={CalendarDays} label="Last updated">
                  {formatDateTime(selectedBooking.updated_at)}
                </DetailRow>
                {selectedBooking.visitor_type === "Group" && (
                  <>
                    <DetailRow icon={Users} label="Organisation / group">
                      {selectedBooking.organisation}
                    </DetailRow>
                    <DetailRow icon={Users} label="Contact person's role">
                      {selectedBooking.contact_role}
                    </DetailRow>
                  </>
                )}
              </div>

              <div className="border-t border-[#eeeae4] pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Additional information
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {selectedBooking.notes || "No additional information provided."}
                </p>
              </div>

              <div className="border-t border-[#eeeae4] pt-6">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Update booking status
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      updatingId === selectedBooking.id ||
                      selectedBooking.status === "Pending"
                    }
                    onClick={() => updateStatus(selectedBooking, "Pending")}
                    className="border border-amber-200 px-4 py-3 text-xs text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark pending
                  </button>
                  <button
                    type="button"
                    disabled={
                      updatingId === selectedBooking.id ||
                      selectedBooking.status === "Approved"
                    }
                    onClick={() => updateStatus(selectedBooking, "Approved")}
                    className="border border-green-200 px-4 py-3 text-xs text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {updatingId === selectedBooking.id
                      ? "Updating..."
                      : "Approve booking"}
                  </button>
                  <button
                    type="button"
                    disabled={
                      updatingId === selectedBooking.id ||
                      selectedBooking.status === "Rejected"
                    }
                    onClick={() => updateStatus(selectedBooking, "Rejected")}
                    className="border border-red-200 px-4 py-3 text-xs text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reject booking
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eeeae4] pt-6">
                <button
                  type="button"
                  disabled={deletingId === selectedBooking.id}
                  onClick={() => deleteBooking(selectedBooking)}
                  className="inline-flex items-center gap-2 text-xs text-red-600 transition hover:text-red-800 disabled:opacity-50"
                >
                  {deletingId === selectedBooking.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  Delete booking
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="bg-[#191919] px-5 py-3 text-xs text-white transition hover:bg-[#a77b45]"
                >
                  Close details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
