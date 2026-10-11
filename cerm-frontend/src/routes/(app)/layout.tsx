import { component$, Slot, $ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useAuthUser } from "~/hooks/user-auth";
import { useUnapprovedProfiles } from "~/hooks/customer-handling";

// ============================================================================
// 1. RE-EXPORT ROUTE LOADERS
// ============================================================================
export { useAuthUser, useUnapprovedProfiles };

// ============================================================================
// 2. QWIK SVG ICON COMPONENTS
// ============================================================================
const IconClipboardList = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
  </svg>
));

const IconLogOut = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
));

// Updated Intake Down Arrow Icon
const IconIntake = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 17V3" />
    <path d="m6 11 6 6 6-6" />
    <path d="M19 21H5" />
  </svg>
));

const IconArchive = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>
  </svg>
));

const IconSend = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
));

const IconUsers = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
));

const IconWrench = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
));

const IconLayers = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
));

const IconMessageSquare = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
));

const IconImageIcon = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
));

const IconBell = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
));

const IconGrid = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
));

const IconDashboard = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="10" rx="1"/><rect width="7" height="5" x="3" y="14" rx="1"/>
  </svg>
));

export const IconChecklist = component$((props: { class?: string }) => (
  <svg
    class={props.class || "w-4 h-4"}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M11 6h9" />
    <path d="M11 12h9" />
    <path d="M11 18h9" />
    <path d="M3 6l2 2 4-4" />
    <path d="M3 12l2 2 4-4" />
    <path d="M3 18l2 2 4-4" />
  </svg>
));

// ============================================================================
// 3. NAVIGATION TYPES
// ============================================================================
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: number;
  isRedBadge?: boolean;
  roles?: string[];
}

// ============================================================================
// 4. MAIN QWIK LAYOUT COMPONENT
// ============================================================================
export default component$(() => {
  const userData = useAuthUser();
  const unapprovedProfiles = useUnapprovedProfiles();
  const location = useLocation();
  const nav = useNavigate();

  const userRole = userData.value?.role || "EMPLOYEE";
  const unapprovedCount = unapprovedProfiles.value?.length ?? 0;

  // Dynamically constructed navigation configuration based on state
  const navigationConfig: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard/",
      icon: IconDashboard,
      roles: ["ADMIN"],
    },
    {
      id: "intake",
      label: "Intake",
      href: "/intake/",
      icon: IconIntake,
      badge: unapprovedCount,
      isRedBadge: unapprovedCount > 0, // Glow red when there are pending unapproved profiles
      roles: ["ADMIN"],
    },
    {
      id: "post-routes",
      label: "Post Routes",
      href: "/post-routes/",
      icon: IconSend,
      roles: ["ADMIN"],
    },
    {
      id: "customer-profiles",
      label: "Customer Profiles",
      href: "/customer-profiles/",
      icon: IconChecklist,
      roles: ["ADMIN"],
    },
    {
      id: "services",
      label: "Services",
      href: "/services/",
      icon: IconWrench,
      roles: ["ADMIN"],
    },
    {
      id: "pages",
      label: "Pages",
      href: "/pages/",
      icon: IconLayers,
      roles: ["ADMIN"],
    },
    {
      id: "reviews",
      label: "Reviews",
      href: "/reviews/",
      icon: IconMessageSquare,
      roles: ["ADMIN"],
    },
    {
      id: "gallery",
      label: "Image Gallery",
      href: "/gallery/",
      icon: IconImageIcon,
      roles: ["ADMIN"],
    },
    {
      id: "archive",
      label: "Archive",
      href: "/archive/",
      icon: IconArchive,
      badge: 12,
      isRedBadge: false,
      roles: ["ADMIN"],
    },
  ];

  // Filter routes based on role
  const filteredNavConfig = navigationConfig.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  const mobileBottomItems = filteredNavConfig.slice(0, 4);

  const handleSignOut = $(async () => {
    document.cookie = "cerm_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    await nav("/");
  });

  return (
    <div class="min-h-screen bg-slate-100 text-gray-900 font-sans flex flex-col h-screen overflow-hidden">
      {/* Top Header Bar */}
      <header class="h-16 px-4 md:px-6 flex items-center justify-between bg-transparent flex-shrink-0 z-30">
        <Link
          href="/dashboard/"
          class="flex items-center gap-3 text-green-700 font-bold text-xl tracking-tight cursor-pointer"
        >
          <div class="w-10 h-10 rounded-xl bg-green-200/60 flex items-center justify-center">
            <IconClipboardList class="w-6 h-6 text-green-700" />
          </div>
          <span class="text-gray-900 font-extrabold text-xl">
            CERM by <span class="text-green-600">Amend</span>
          </span>
        </Link>

        {/* Header Actions */}
        <div class="flex items-center gap-2 md:gap-3">
          <button class="p-2.5 rounded-xl bg-gray-200/70 hover:bg-gray-200 text-gray-700 transition-all">
            <IconBell class="w-5 h-5" />
          </button>
          <button
            onClick$={handleSignOut}
            class="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs font-semibold bg-gray-200/70 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all"
            title="Sign Out"
          >
            <IconLogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Application Layout */}
      <div class="flex-1 flex overflow-hidden relative">
        {/* Desktop Fixed Layout Spacer */}
        <div class="hidden md:block w-20 flex-shrink-0" />

        {/* Desktop Expand-on-Hover Left Sidebar */}
        <aside class="hidden md:flex group absolute top-0 left-0 bottom-0 z-40 w-20 hover:w-64 transition-all duration-300 ease-in-out py-4 pl-3 pr-3 flex-col gap-2 overflow-hidden bg-slate-100/95 backdrop-blur-md hover:shadow-2xl border-none">
          {filteredNavConfig.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.url.pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                class={`w-full flex items-center gap-4 p-3.5 text-base font-semibold rounded-2xl ${
                  isActive
                    ? "bg-green-600 text-white font-bold shadow-md shadow-green-600/20"
                    : "text-gray-700 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                {/* Nav Icon with Badge Overlay */}
                <div class="flex-shrink-0 flex items-center justify-center relative">
                  <IconComponent class={`w-7 h-7 ${isActive ? "text-white" : "text-gray-600"}`} />

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      class={`absolute -top-2 -right-3 px-2 py-0.5 min-w-[22px] h-5 rounded-full text-xs font-bold leading-none flex items-center justify-center transition-all ${
                        item.isRedBadge
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse"
                          : isActive
                          ? "bg-white text-green-800 shadow-sm"
                          : "bg-slate-200/90 text-slate-700 shadow-sm"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label Revealed on Sidebar Hover */}
                <span
                  class={`opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs whitespace-nowrap overflow-hidden text-sm ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Main Workspace Container */}
        <main class="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex justify-center pb-24 md:pb-6">
          <div class="w-full max-w-5xl">
            <Slot />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav class="fixed bottom-0 left-0 right-0 h-16 bg-slate-100/95 backdrop-blur-md border-t border-gray-200/80 flex items-center justify-around px-2 z-50 md:hidden shadow-lg">
          {mobileBottomItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.url.pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                class={`flex flex-col items-center justify-center p-2 rounded-xl relative ${
                  isActive ? "text-green-600 scale-110 font-bold" : "text-gray-600"
                }`}
              >
                <div class="relative">
                  <IconComponent class="w-6 h-6" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      class={`absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[10px] font-bold leading-none flex items-center justify-center transition-all ${
                        item.isRedBadge 
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/50 animate-pulse" 
                          : "bg-slate-300 text-slate-800 shadow-sm"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <Link
            href="/dashboard/"
            class="flex flex-col items-center justify-center p-2 rounded-xl text-gray-600"
            title="Dashboard"
          >
            <IconGrid class="w-6 h-6" />
          </Link>
        </nav>
      </div>
    </div>
  );
});