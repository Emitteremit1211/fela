
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Images,
  CalendarDays,
  Megaphone,
  LogOut,
  ExternalLink,
  ArrowUpRight,
  Loader2,
  Menu,
  X,
  RefreshCw,
  ClipboardList,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import GalleryManagement from "./GalleryManagement";
import WhatsOnManagement from "./WhatsOnManagement";
import VisitBookingsManagement from "./VisitBookingsManagement";
import UsersManagement from "./UsersManagement";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, view: "overview" },
  { label: "Gallery", icon: Images, view: "gallery" },
  { label: "What's On", icon: CalendarDays, view: "whats-on", navKey: "events" },
  { label: "Announcements", icon: Megaphone, view: "whats-on", navKey: "announcements" },
  { label: "Visit Bookings", icon: ClipboardList, view: "bookings" },
];

function getErrorMessage(error) {
  if (!error) return "Unknown database error";
  if (typeof error === "string") return error;

  const parts = [
    error.message,
    error.details,
    error.hint,
    error.code ? `Code: ${error.code}` : null,
  ].filter(Boolean);

  if (parts.length) return parts.join(" | ");

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    gallery: 0,
    events: 0,
    announcements: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [activeWhatsOnTab, setActiveWhatsOnTab] = useState("events");

  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Load the signed-in user's own role.
  useEffect(() => {
    let mounted = true;

    const loadUserRole = async () => {
      if (!user?.id) {
        if (mounted) {
          setUserRole(null);
          setRoleLoading(false);
        }
        return;
      }

      setRoleLoading(true);

      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (mounted) {
          setUserRole(data?.role ?? null);
        }
      } catch (err) {
        console.error("Unable to load administrator role:", err);

        if (mounted) {
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setRoleLoading(false);
        }
      }
    };

    loadUserRole();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const isSuperadmin = userRole === "superadmin";

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const checks = [
        { key: "gallery", table: "gallery_items" },
        { key: "events", table: "events" },
        { key: "announcements", table: "announcements" },
        { key: "bookings", table: "visit_bookings" },
      ];

      const results = await Promise.all(
        checks.map(async ({ key, table }) => {
          try {
            const response = await supabase
              .from(table)
              .select("id", { count: "exact", head: true });

            if (response.error) {
              console.error(`${table} error:`, response.error);
            }

            return {
              key,
              table,
              count: response.count ?? 0,
              error: response.error,
            };
          } catch (err) {
            console.error(`${table} request failed:`, err);

            return {
              key,
              table,
              count: 0,
              error: err,
            };
          }
        })
      );

      const failed = results.filter((result) => result.error);

      if (failed.length > 0) {
        setError(
          failed
            .map(
              (item) =>
                `${item.table}: ${getErrorMessage(item.error)}`
            )
            .join("\n")
        );
      }

      setStats({
        gallery:
          results.find((item) => item.key === "gallery" && !item.error)
            ?.count ?? 0,
        events:
          results.find((item) => item.key === "events" && !item.error)
            ?.count ?? 0,
        announcements:
          results.find(
            (item) => item.key === "announcements" && !item.error
          )?.count ?? 0,
        bookings:
          results.find((item) => item.key === "bookings" && !item.error)
            ?.count ?? 0,
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
      setError(`Unable to sign out: ${getErrorMessage(err)}`);
    }
  };

  const handleNavigation = (view, tab = "events") => {
    if (view === "users" && !isSuperadmin) return;

    setActiveView(view);

    if (view === "whats-on") {
      setActiveWhatsOnTab(tab);
    }

    setSidebarOpen(false);
    setError("");
  };

  const handleWhatsOnStats = (counts) => {
    setStats((previous) => ({
      ...previous,
      events: counts.events,
      announcements: counts.announcements,
    }));
  };

  const handleBookingStats = useCallback((counts) => {
    setStats((previous) => ({
      ...previous,
      bookings: counts.total,
    }));
  }, []);

  const cards = [
    {
      label: "Gallery photographs",
      value: stats.gallery,
      description: "Total gallery records",
      icon: Images,
      action: "gallery",
    },
    {
      label: "Events",
      value: stats.events,
      description: "Total event records",
      icon: CalendarDays,
      action: "whats-on",
    },
    {
      label: "Announcements",
      value: stats.announcements,
      description: "Total announcement records",
      icon: Megaphone,
      action: "whats-on",
    },
    {
      label: "Visit bookings",
      value: stats.bookings,
      description: "Visitor booking requests",
      icon: ClipboardList,
      action: "bookings",
    },
  ];

  const currentTitle =
    activeView === "gallery"
      ? "Gallery"
      : activeView === "whats-on"
        ? activeWhatsOnTab === "announcements"
          ? "Announcements"
          : "What's On"
        : activeView === "bookings"
          ? "Visit Bookings"
          : activeView === "users"
            ? "Users"
            : "Overview";

  const visibleNavigation = [
    ...navigation,
    ...(isSuperadmin
      ? [{ label: "Users", icon: Users, view: "users" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#191919]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#e9e6e0] bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[88px] items-center justify-between border-b border-[#eeeae4] px-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#a77b45]">
              Fela Retrospective
            </p>
            <h1 className="mt-1 font-serif text-xl">
              Administration
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-9">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {roleLoading ? (
              <div className="flex items-center gap-3 px-3 py-3 text-xs text-gray-400">
                <Loader2 size={15} className="animate-spin" />
                Loading permissions...
              </div>
            ) : (
              visibleNavigation.map((item, index) => {
                const Icon = item.icon;

                const isActive =
                  activeView === item.view &&
                  (item.view !== "whats-on" ||
                    (item.navKey || "events") === activeWhatsOnTab);

                return (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.view,
                        item.navKey || "events"
                      )
                    }
                    className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "bg-[#f5f1eb] text-[#9b713e]"
                        : "text-gray-500 hover:bg-[#faf9f7]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} strokeWidth={1.7} />
                      {item.label}
                    </span>
                  </button>
                );
              })
            )}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#eeeae4] p-5">
          <div className="mb-5 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ece4] font-serif text-sm text-[#9b713e]">
              {user?.email?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-[#222]">
                {isSuperadmin ? "Superadmin" : "Administrator"}
              </p>
              <p className="max-w-[175px] truncate text-[10px] text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-3 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[270px]">
        <header className="flex h-[88px] items-center justify-between border-b border-[#e9e6e0] bg-white px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Workspace
              </p>
              <h2 className="mt-1 font-serif text-xl">
                {currentTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeView === "overview" && (
              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="flex items-center gap-2 border border-[#e8e4dd] px-3 py-2 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45] disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 border border-[#e8e4dd] px-3 py-2 text-xs text-gray-600 transition hover:border-[#a77b45] hover:text-[#a77b45] sm:px-4"
            >
              <span>View website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
          {activeView === "gallery" ? (
            <GalleryManagement
              onBack={() => handleNavigation("overview")}
              onStatsChange={(count) =>
                setStats((previous) => ({
                  ...previous,
                  gallery: count,
                }))
              }
            />
          ) : activeView === "whats-on" ? (
            <WhatsOnManagement
              onBack={() => handleNavigation("overview")}
              onStatsChange={handleWhatsOnStats}
            />
          ) : activeView === "bookings" ? (
            <VisitBookingsManagement
              onBack={() => handleNavigation("overview")}
              onStatsChange={handleBookingStats}
            />
          ) : activeView === "users" && isSuperadmin ? (
            <UsersManagement
              onBack={() => handleNavigation("overview")}
            />
          ) : (
            <>
              <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#a77b45]">
                    Exhibition management
                  </p>

                  <h1 className="font-serif text-3xl sm:text-4xl">
                    Welcome back.
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                    Manage the content and updates for Fela
                    Anikulapo-Kuti: A Retrospective from one place.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="mt-1 text-sm font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 whitespace-pre-wrap break-words border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
                  <p className="mb-1 font-semibold">
                    Database connection issue
                  </p>
                  {error}
                </div>
              )}

              <div className="mb-12">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl">
                    Content overview
                  </h2>

                  {loading && (
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      <Loader2 size={14} className="animate-spin" />
                      Loading statistics
                    </span>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <button
                        key={card.label}
                        type="button"
                        onClick={() => handleNavigation(card.action)}
                        className="border border-[#e9e6e0] bg-white p-6 text-left transition hover:border-[#a77b45] sm:p-7"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {card.label}
                          </p>
                          <Icon
                            size={19}
                            className="text-[#a77b45]"
                          />
                        </div>

                        <div className="mt-7">
                          <p className="font-serif text-4xl">
                            {loading ? "—" : card.value}
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            {card.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <section>
                <div className="mb-5">
                  <h2 className="font-serif text-xl">
                    Manage your exhibition
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Your main content management areas.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleNavigation("gallery")}
                    className="border border-[#e9e6e0] bg-white p-6 text-left transition hover:border-[#a77b45] sm:p-8"
                  >
                    <div className="mb-7 flex h-11 w-11 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
                      <Images size={20} />
                    </div>

                    <h3 className="font-serif text-2xl">Gallery</h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                      Upload exhibition photographs, add captions and
                      photo credits, arrange their display order and
                      publish them on the public website.
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs text-[#a77b45]">
                      Manage gallery
                      <ArrowUpRight size={15} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigation("whats-on")}
                    className="border border-[#e9e6e0] bg-white p-6 text-left transition hover:border-[#a77b45] sm:p-8"
                  >
                    <div className="mb-7 flex h-11 w-11 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
                      <CalendarDays size={20} />
                    </div>

                    <h3 className="font-serif text-2xl">
                      What's On
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                      Create upcoming events, manage past events and
                      publish announcements for visitors to see on
                      the website.
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs text-[#a77b45]">
                      Manage What's On
                      <ArrowUpRight size={15} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigation("bookings")}
                    className="border border-[#e9e6e0] bg-white p-6 text-left transition hover:border-[#a77b45] sm:p-8"
                  >
                    <div className="mb-7 flex h-11 w-11 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
                      <ClipboardList size={20} />
                    </div>

                    <h3 className="font-serif text-2xl">
                      Visit Bookings
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                      Review individual and group visit requests,
                      contact visitors and approve or reject bookings.
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs text-[#a77b45]">
                      Manage visit bookings
                      <ArrowUpRight size={15} />
                    </div>
                  </button>

                  {isSuperadmin && (
                    <button
                      type="button"
                      onClick={() => handleNavigation("users")}
                      className="border border-[#e9e6e0] bg-white p-6 text-left transition hover:border-[#a77b45] sm:p-8"
                    >
                      <div className="mb-7 flex h-11 w-11 items-center justify-center bg-[#f5f1eb] text-[#a77b45]">
                        <Users size={20} />
                      </div>

                      <h3 className="font-serif text-2xl">
                        Users
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                        Invite administrators and manage access to
                        the exhibition administration panel.
                      </p>

                      <div className="mt-7 flex items-center gap-2 text-xs text-[#a77b45]">
                        Manage users
                        <ArrowUpRight size={15} />
                      </div>
                    </button>
                  )}
                </div>
              </section>

              <div className="mt-12 border-t border-[#e9e6e0] pt-6">
                <p className="text-xs leading-6 text-gray-400">
                  Fela Anikulapo-Kuti: A Retrospective · Administration
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
