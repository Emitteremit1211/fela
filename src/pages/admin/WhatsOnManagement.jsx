
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const BUCKET = "whats-on-images";
const SIGNED_URL_DURATION = 3600;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  status: "draft",
  display_order: 0,
};

function getErrorMessage(error) {
  if (!error) return "Something went wrong.";

  return [
    error.message,
    error.details,
    error.hint,
    error.code ? `Code: ${error.code}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

function formatDate(value) {
  if (!value) return "No date set";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getImageUrl(path) {
  if (!path) return "";

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_DURATION);

  if (error) {
    console.error("Image URL error:", error);
    return "";
  }

  return data?.signedUrl || "";
}

export default function WhatsOnManagement({
  onBack,
  onStatsChange,
}) {
  const onStatsChangeRef = useRef(onStatsChange);
  onStatsChangeRef.current = onStatsChange;

  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingStoragePath, setExistingStoragePath] = useState("");
  const fileInputRef = useRef(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [eventResponse, announcementResponse] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true })
          .order("display_order", { ascending: true }),
        supabase
          .from("announcements")
          .select("*")
          .order("announcement_date", { ascending: false }),
      ]);

      if (eventResponse.error) throw eventResponse.error;
      if (announcementResponse.error) throw announcementResponse.error;

      const eventRows = await Promise.all(
        (eventResponse.data || []).map(async (item) => ({
          ...item,
          signedImage: await getImageUrl(item.storage_path),
        }))
      );

      const announcementRows = await Promise.all(
        (announcementResponse.data || []).map(async (item) => ({
          ...item,
          signedImage: await getImageUrl(item.storage_path),
        }))
      );

      setEvents(eventRows);
      setAnnouncements(announcementRows);

      onStatsChangeRef.current?.({
        events: eventRows.length,
        announcements: announcementRows.length,
      });
    } catch (err) {
      console.error("What's On loading error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSelectedImage(null);
    setExistingStoragePath("");
    setImagePreview("");
    setFormOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openNewForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const openEditForm = (item) => {
    setError("");
    setSuccess("");
    setEditingId(item.id);
    setExistingStoragePath(item.storage_path || "");
    setSelectedImage(null);
    setImagePreview(item.signedImage || "");

    if (activeTab === "events") {
      setForm({
        title: item.title || "",
        description: item.description || "",
        date: item.event_date || "",
        time: item.event_time || "",
        venue: item.venue || "",
        status: item.status || "draft",
        display_order: item.display_order ?? 0,
      });
    } else {
      setForm({
        title: item.title || "",
        description: item.description || "",
        date: item.announcement_date || "",
        time: "",
        venue: "",
        status: item.status || "draft",
        display_order: 0,
      });
    }

    setFormOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must not exceed 10MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadImage = async () => {
    if (!selectedImage) return existingStoragePath || null;

    const extension =
      selectedImage.name.split(".").pop()?.toLowerCase() || "jpg";

    const folder = activeTab === "events" ? "events" : "announcements";
    const filePath = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, selectedImage, {
        cacheControl: "3600",
        upsert: false,
        contentType: selectedImage.type,
      });

    if (uploadError) throw uploadError;

    return filePath;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!form.date) {
      setError(
        activeTab === "events"
          ? "Please select the event date."
          : "Please select the announcement date."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    let uploadedPath = null;

    try {
      const imagePath = await uploadImage();

      if (selectedImage) uploadedPath = imagePath;

      const commonPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: null,
        storage_path: imagePath,
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      let response;

      if (activeTab === "events") {
        const payload = {
          ...commonPayload,
          event_date: form.date,
          event_time: form.time.trim() || null,
          venue: form.venue.trim() || null,
          display_order: Number(form.display_order) || 0,
        };

        response = editingId
          ? await supabase
              .from("events")
              .update(payload)
              .eq("id", editingId)
          : await supabase.from("events").insert({
              ...payload,
              created_at: new Date().toISOString(),
            });
      } else {
        const payload = {
          ...commonPayload,
          announcement_date: form.date,
        };

        response = editingId
          ? await supabase
              .from("announcements")
              .update(payload)
              .eq("id", editingId)
          : await supabase.from("announcements").insert({
              ...payload,
              created_at: new Date().toISOString(),
            });
      }

      if (response.error) throw response.error;

      if (
        selectedImage &&
        existingStoragePath &&
        existingStoragePath !== imagePath
      ) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove([existingStoragePath]);

        if (removeError) {
          console.warn("Old image could not be removed:", removeError);
        }
      }

      setSuccess(
        editingId
          ? "Your content has been updated successfully."
          : "Your content has been created successfully."
      );

      resetForm();
      await loadContent();
    } catch (err) {
      console.error("What's On save error:", err);

      if (uploadedPath) {
        await supabase.storage.from(BUCKET).remove([uploadedPath]);
      }

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const table = activeTab === "events" ? "events" : "announcements";

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET)
          .remove([item.storage_path]);

        if (storageError) {
          console.warn("Image could not be removed:", storageError);
        }
      }

      setSuccess("Content deleted successfully.");
      await loadContent();
    } catch (err) {
      console.error("What's On delete error:", err);
      setError(getErrorMessage(err));
    }
  };

  const handleStatusChange = async (item, status) => {
    setError("");
    setSuccess("");

    try {
      const table = activeTab === "events" ? "events" : "announcements";

      const { error: updateError } = await supabase
        .from(table)
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (updateError) throw updateError;

      setSuccess(
        status === "published"
          ? "Content published successfully."
          : status === "cancelled"
            ? "Event marked as cancelled."
            : "Content saved as draft."
      );

      await loadContent();
    } catch (err) {
      console.error("Status update error:", err);
      setError(getErrorMessage(err));
    }
  };

  const currentItems = activeTab === "events" ? events : announcements;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={15} />
            Back to overview
          </button>

          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#a77b45]">
            Exhibition management
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl">What's On</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Manage exhibition events, programmes and announcements.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContent}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 border border-[#e8e4dd] bg-white px-4 py-3 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#e9e6e0] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total events</p>
            <CalendarDays size={18} className="text-[#a77b45]" />
          </div>
          <p className="mt-4 font-serif text-3xl">{events.length}</p>
        </div>

        <div className="border border-[#e9e6e0] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total announcements</p>
            <Megaphone size={18} className="text-[#a77b45]" />
          </div>
          <p className="mt-4 font-serif text-3xl">{announcements.length}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#e9e6e0] sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab("events");
              setError("");
              setSuccess("");
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-4 text-xs transition ${
              activeTab === "events"
                ? "border-[#a77b45] text-[#9b713e]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <CalendarDays size={15} />
            Events ({events.length})
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab("announcements");
              setError("");
              setSuccess("");
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-4 text-xs transition ${
              activeTab === "announcements"
                ? "border-[#a77b45] text-[#9b713e]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Megaphone size={15} />
            Announcements ({announcements.length})
          </button>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="mb-3 inline-flex items-center justify-center gap-2 bg-[#171717] px-5 py-3 text-xs text-white transition hover:bg-[#a77b45] sm:mb-0"
        >
          <Plus size={15} />
          Add {activeTab === "events" ? "event" : "announcement"}
        </button>
      </div>

      {error && (
        <div className="mb-5 whitespace-pre-wrap break-words border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 border border-[#e9e6e0] bg-white p-5 sm:p-7"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#a77b45]">
                {editingId ? "Edit content" : "New content"}
              </p>
              <h2 className="mt-1 font-serif text-2xl">
                {editingId ? "Update" : "Create"}{" "}
                {activeTab === "events" ? "Event" : "Announcement"}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
              className="p-2 text-gray-400 hover:text-gray-900"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-medium text-gray-600">
                Title *
              </span>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    title: e.target.value,
                  }))
                }
                placeholder={
                  activeTab === "events"
                    ? "Enter event title"
                    : "Enter announcement title"
                }
                className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none transition focus:border-[#a77b45]"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-medium text-gray-600">
                Description *
              </span>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    description: e.target.value,
                  }))
                }
                placeholder="Write the details visitors should know..."
                className="w-full resize-y border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#a77b45]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-gray-600">
                {activeTab === "events" ? "Event date *" : "Announcement date *"}
              </span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    date: e.target.value,
                  }))
                }
                className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
              />
            </label>

            {activeTab === "events" && (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-gray-600">
                    Event time
                  </span>
                  <input
                    value={form.time}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        time: e.target.value,
                      }))
                    }
                    placeholder="e.g. 3:00 PM"
                    className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-medium text-gray-600">
                    Venue
                  </span>
                  <input
                    value={form.venue}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        venue: e.target.value,
                      }))
                    }
                    placeholder="Enter event venue"
                    className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-gray-600">
                    Display order
                  </span>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        display_order: e.target.value,
                      }))
                    }
                    className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-gray-600">
                Publication status
              </span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    status: e.target.value,
                  }))
                }
                className="w-full border border-[#e7e3dc] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
              >
                <option value="draft">Draft — not public</option>
                <option value="published">Published — visible publicly</option>
                {activeTab === "events" && (
                  <option value="cancelled">Cancelled</option>
                )}
              </select>
            </label>

            <div className="md:col-span-2">
              <span className="mb-2 block text-xs font-medium text-gray-600">
                {activeTab === "events" ? "Event image" : "Announcement image"}
              </span>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {imagePreview ? (
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100 sm:w-56">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview.startsWith("blob:")) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        setImagePreview("");
                        setSelectedImage(null);
                        setExistingStoragePath("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black/70 text-white"
                      aria-label="Remove selected image"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-36 w-full flex-col items-center justify-center border border-dashed border-[#d9d3c9] bg-[#faf9f7] text-gray-400 sm:w-56">
                    <ImageIcon size={25} />
                    <span className="mt-2 text-xs">No image selected</span>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-[#e7e3dc] px-4 py-3 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45]"
                  >
                    <Upload size={15} />
                    Choose image
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <p className="mt-3 text-[11px] leading-5 text-gray-400">
                    Image is optional. Maximum file size: 10MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#eeeae4] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="border border-[#e7e3dc] px-5 py-3 text-xs text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-[#171717] px-6 py-3 text-xs text-white transition hover:bg-[#a77b45] disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create content"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center border border-[#e9e6e0] bg-white py-20 text-sm text-gray-400">
          <Loader2 size={18} className="mr-3 animate-spin" />
          Loading {activeTab}...
        </div>
      ) : currentItems.length === 0 ? (
        <div className="border border-dashed border-[#dcd7cf] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
            {activeTab === "events" ? (
              <CalendarDays size={23} />
            ) : (
              <Megaphone size={23} />
            )}
          </div>
          <h3 className="mt-5 font-serif text-2xl">
            No {activeTab} yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first {activeTab === "events" ? "event" : "announcement"} to get started.
          </p>
          <button
            type="button"
            onClick={openNewForm}
            className="mt-6 inline-flex items-center gap-2 bg-[#171717] px-5 py-3 text-xs text-white transition hover:bg-[#a77b45]"
          >
            <Plus size={14} />
            Add {activeTab === "events" ? "event" : "announcement"}
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {currentItems.map((item) => (
            <article
              key={item.id}
              className="flex h-full flex-col overflow-hidden border border-[#e9e6e0] bg-white"
            >
              <div className="relative aspect-[16/9] bg-[#f2f0ec]">
                {item.signedImage ? (
                  <img
                    src={item.signedImage}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#a77b45]">
                    {activeTab === "events" ? (
                      <CalendarDays size={30} />
                    ) : (
                      <Megaphone size={30} />
                    )}
                  </div>
                )}

                <span
                  className={`absolute left-4 top-4 px-3 py-2 text-[9px] font-semibold uppercase tracking-wider ${
                    item.status === "published"
                      ? "bg-green-100 text-green-700"
                      : item.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status || "draft"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] uppercase tracking-[0.13em] text-[#a77b45]">
                  {formatDate(
                    activeTab === "events"
                      ? item.event_date
                      : item.announcement_date
                  )}
                  {activeTab === "events" && item.event_time
                    ? ` · ${item.event_time}`
                    : ""}
                </p>

                <h3 className="mt-3 font-serif text-2xl leading-tight">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                {activeTab === "events" && item.venue && (
                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    {item.venue}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#eeeae4] pt-5 mt-5">
                  {item.status === "published" ? (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item, "draft")}
                      className="inline-flex items-center gap-1.5 border border-[#e7e3dc] px-3 py-2 text-[10px] text-gray-600 hover:border-amber-400 hover:text-amber-700"
                    >
                      <EyeOff size={13} />
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item, "published")}
                      className="inline-flex items-center gap-1.5 border border-[#e7e3dc] px-3 py-2 text-[10px] text-gray-600 hover:border-green-400 hover:text-green-700"
                    >
                      <Eye size={13} />
                      Publish
                    </button>
                  )}

                  {activeTab === "events" && item.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item, "cancelled")}
                      className="border border-[#e7e3dc] px-3 py-2 text-[10px] text-gray-600 hover:border-red-300 hover:text-red-600"
                    >
                      Cancel event
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    className="ml-auto inline-flex items-center gap-1.5 border border-[#e7e3dc] px-3 py-2 text-[10px] text-gray-600 hover:border-[#a77b45] hover:text-[#a77b45]"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-1.5 border border-[#e7e3dc] px-3 py-2 text-[10px] text-gray-600 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
