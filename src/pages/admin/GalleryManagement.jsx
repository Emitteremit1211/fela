
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
  Eye,
  EyeOff,
  Images,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const BUCKET = "gallery-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CATEGORIES = [
  {
    value: "Exhibition Moments",
    description:
      "Fela photographs, archival materials, exhibition displays and installations.",
  },
  {
    value: "Visitor Experiences",
    description:
      "Visitors, school trips, group visits and visitor experiences.",
  },
];

const emptyForm = {
  title: "",
  description: "",
  photo_credit: "",
  category: "Exhibition Moments",
  display_order: 0,
  is_published: false,
};

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.details ||
    error?.hint ||
    "Something went wrong. Please try again."
  );
}

export default function GalleryManagement({ onBack, onStatsChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Keep the latest dashboard callback without making loadGallery
  // change every time the parent dashboard renders.
  const onStatsChangeRef = useRef(onStatsChange);
  onStatsChangeRef.current = onStatsChange;

  // Stable loading function: it will not be recreated on every render.
  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      const rows = data || [];

      const withImages = await Promise.all(
        rows.map(async (item) => {
          if (!item.storage_path) {
            return {
              ...item,
              signed_url: item.image_url || "",
            };
          }

          const { data: signedData, error: signedError } =
            await supabase.storage
              .from(BUCKET)
              .createSignedUrl(item.storage_path, 60 * 60);

          if (signedError) {
            console.error("Image preview error:", signedError);

            return {
              ...item,
              signed_url: "",
            };
          }

          return {
            ...item,
            signed_url: signedData?.signedUrl || "",
          };
        })
      );

      setItems(withImages);

      // Notify the dashboard without creating a refresh loop.
      onStatsChangeRef.current?.(rows.length);
    } catch (err) {
      console.error("Gallery loading error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs when this page mounts. loadGallery is stable now.
  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedFile(null);
    setPreview("");
    setEditingItem(null);
    setShowForm(false);
  };

  const startNew = () => {
    setError("");
    setSuccess("");
    setEditingItem(null);

    setForm({
      ...emptyForm,
      display_order: items.length,
    });

    setSelectedFile(null);
    setPreview("");
    setShowForm(true);
  };

  const startEdit = (item) => {
    setError("");
    setSuccess("");
    setEditingItem(item);

    setForm({
      title: item.title || "",
      description: item.description || "",
      photo_credit: item.photo_credit || "",
      category: item.category || "Exhibition Moments",
      display_order: item.display_order ?? 0,
      is_published: !!item.is_published,
    });

    setSelectedFile(null);
    setPreview(item.signed_url || item.image_url || "");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const uploadImage = async (file) => {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const path = `${Date.now()}-${uniqueId}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    return path;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!editingItem && !selectedFile) {
      setError("Please choose a photograph to upload.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a photograph title.");
      return;
    }

    if (
      !CATEGORIES.some(
        (category) => category.value === form.category
      )
    ) {
      setError("Please select a valid photograph category.");
      return;
    }

    setSaving(true);

    let uploadedPath = null;

    try {
      let storagePath = editingItem?.storage_path || null;

      if (selectedFile) {
        uploadedPath = await uploadImage(selectedFile);
        storagePath = uploadedPath;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        photo_credit: form.photo_credit.trim() || null,
        category: form.category,
        display_order: Number(form.display_order) || 0,
        is_published: !!form.is_published,
        storage_path: storagePath,
        image_url: null,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (editingItem) {
        result = await supabase
          .from("gallery_items")
          .update(payload)
          .eq("id", editingItem.id);
      } else {
        result = await supabase
          .from("gallery_items")
          .insert(payload);
      }

      if (result.error) throw result.error;

      // Remove the old image only after the database update succeeds.
      if (
        editingItem &&
        uploadedPath &&
        editingItem.storage_path
      ) {
        const { error: removeError } = await supabase.storage
          .from(BUCKET)
          .remove([editingItem.storage_path]);

        if (removeError) {
          console.error("Old image cleanup failed:", removeError);
        }
      }

      resetForm();

      setSuccess(
        editingItem
          ? "Photograph updated successfully."
          : "Photograph uploaded successfully."
      );

      await loadGallery();
    } catch (err) {
      console.error("Gallery save error:", err);

      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error("Upload cleanup failed:", cleanupError);
        }
      }

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item) => {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("gallery_items")
      .update({
        is_published: !item.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (updateError) {
      setError(getErrorMessage(updateError));
      return;
    }

    setSuccess(
      item.is_published
        ? "Photograph unpublished."
        : "Photograph published."
    );

    await loadGallery();
  };

  const deleteItem = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This will permanently remove the photograph and its database record.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const { error: deleteError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      if (item.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET)
          .remove([item.storage_path]);

        if (storageError) {
          console.error("Storage cleanup failed:", storageError);

          setError(
            "The gallery record was deleted, but its stored image could not be removed. Please check storage permissions."
          );
        }
      }

      setSuccess("Photograph deleted.");

      await loadGallery();
    } catch (err) {
      console.error("Gallery deletion error:", err);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#a77b45]"
          >
            <ArrowLeft size={15} />
            Back to overview
          </button>

          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#a77b45]">
            Exhibition content
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl">
            Gallery management
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
            Upload, organise and publish photographs for the public
            exhibition gallery.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadGallery}
            disabled={loading}
            className="flex items-center gap-2 border border-[#e8e4dd] bg-white px-4 py-3 text-xs text-gray-600 hover:border-[#a77b45] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={startNew}
            className="flex items-center gap-2 bg-[#191919] px-5 py-3 text-xs text-white transition hover:bg-[#a77b45]"
          >
            <Plus size={15} />
            Add photograph
          </button>
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="mb-5 whitespace-pre-wrap border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-10 border border-[#e9e6e0] bg-white p-5 sm:p-8"
        >
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#a77b45]">
                {editingItem ? "Edit photograph" : "New gallery item"}
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                {editingItem ? "Update photograph" : "Add a photograph"}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-gray-400 hover:text-black"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
            {/* IMAGE UPLOAD */}

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                Photograph
              </label>

              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-[#d9d3c9] bg-[#faf9f7] text-center transition hover:border-[#a77b45]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Selected photograph preview"
                    className="h-[260px] w-full object-contain"
                  />
                ) : (
                  <div className="px-5 py-10">
                    <ImagePlus
                      size={32}
                      className="mx-auto mb-4 text-[#a77b45]"
                    />

                    <p className="text-sm font-medium">
                      Choose an image
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      JPG, PNG or WebP · Maximum 10 MB
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <p className="mt-2 break-all text-xs text-gray-500">
                  Selected: {selectedFile.name}
                </p>
              )}

              {editingItem && (
                <p className="mt-2 text-xs text-gray-400">
                  Leave the image unchanged to keep the existing photograph.
                </p>
              )}
            </div>

            {/* PHOTOGRAPH DETAILS */}

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Photograph title *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter photograph title"
                  className="w-full border border-[#e8e4dd] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                />
              </div>

              {/* CATEGORY SELECTOR */}

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Photograph category *
                </label>

                <select
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-[#e8e4dd] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.value}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  {
                    CATEGORIES.find(
                      (category) => category.value === form.category
                    )?.description
                  }
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Description / caption
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a short description or caption..."
                  className="w-full resize-y border border-[#e8e4dd] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Photo credit
                </label>

                <input
                  value={form.photo_credit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      photo_credit: e.target.value,
                    })
                  }
                  placeholder="Photographer or archive credit"
                  className="w-full border border-[#e8e4dd] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-600">
                  Display order
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: e.target.value,
                    })
                  }
                  className="w-full border border-[#e8e4dd] px-4 py-3 text-sm outline-none focus:border-[#a77b45]"
                />

                <p className="mt-2 text-[11px] text-gray-400">
                  Lower numbers appear earlier in the gallery.
                </p>
              </div>

              {/* PUBLISH TOGGLE */}

              <label className="flex cursor-pointer items-center gap-3 border border-[#eeeae4] p-4">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_published: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#a77b45]"
                />

                <span>
                  <span className="block text-sm font-medium">
                    Publish photograph
                  </span>

                  <span className="mt-1 block text-xs text-gray-400">
                    Make this photograph available on the public website.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eeeae4] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="border border-[#e8e4dd] px-6 py-3 text-xs text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-[#191919] px-7 py-3 text-xs text-white transition hover:bg-[#a77b45] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}

              {saving
                ? "Saving..."
                : editingItem
                  ? "Save changes"
                  : "Upload photograph"}
            </button>
          </div>
        </form>
      )}

      {/* GALLERY LIST */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl">All photographs</h2>

          <p className="mt-1 text-xs text-gray-400">
            {items.length}{" "}
            {items.length === 1 ? "photograph" : "photographs"} in your gallery
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center gap-3 text-sm text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          Loading gallery...
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-[#dcd7cf] bg-white px-6 py-16 text-center">
          <Images
            size={34}
            className="mx-auto mb-4 text-[#b9a78e]"
          />

          <h3 className="font-serif text-2xl">
            Your gallery is empty
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
            Upload your first exhibition photograph to begin building the public gallery.
          </p>

          <button
            type="button"
            onClick={startNew}
            className="mt-6 inline-flex items-center gap-2 bg-[#191919] px-5 py-3 text-xs text-white hover:bg-[#a77b45]"
          >
            <Upload size={15} />
            Upload first photograph
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden border border-[#e9e6e0] bg-white"
            >
              <div className="relative aspect-[4/3] bg-[#f1efeb]">
                {item.signed_url ? (
                  <img
                    src={item.signed_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    Image preview unavailable
                  </div>
                )}

                <span
                  className={`absolute left-3 top-3 px-3 py-1.5 text-[9px] uppercase tracking-wider ${
                    item.is_published
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {item.is_published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#a77b45]">
                      {item.category || "Exhibition Moments"}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Display order: {item.display_order ?? 0}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-6 text-gray-500">
                    {item.description}
                  </p>
                )}

                {item.photo_credit && (
                  <p className="mt-3 text-[10px] text-gray-400">
                    Credit: {item.photo_credit}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#eeeae4] pt-4">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="flex items-center gap-1.5 border border-[#e8e4dd] px-3 py-2 text-[11px] text-gray-600 hover:border-[#a77b45] hover:text-[#a77b45]"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className="flex items-center gap-1.5 border border-[#e8e4dd] px-3 py-2 text-[11px] text-gray-600 hover:border-[#a77b45] hover:text-[#a77b45]"
                  >
                    {item.is_published ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}

                    {item.is_published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteItem(item)}
                    className="ml-auto flex items-center gap-1.5 border border-red-100 px-3 py-2 text-[11px] text-red-600 hover:bg-red-50"
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
