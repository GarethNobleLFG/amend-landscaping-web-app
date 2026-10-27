import { component$, Slot, $, useSignal } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { useAuthUser } from "~/hooks/user-auth";
import { useUnapprovedProfiles } from "~/hooks/job-profile-handling";
import { IconDashboard, IconIntake, IconSend, IconChecklist, IconUsers, IconTeams, IconDotsVertical, IconLogOut } from "~/components/ui/icons";

// ============================================================================
// 1. RE-EXPORT ROUTE LOADERS
// ============================================================================
export { useAuthUser, useUnapprovedProfiles };

// ============================================================================
// 2. NAVIGATION TYPES
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
// 3. MAIN QWIK LAYOUT COMPONENT
// ============================================================================
export default component$(() => {
  const userData = useAuthUser();
  const unapprovedProfiles = useUnapprovedProfiles();
  const location = useLocation();
  const nav = useNavigate();

  const userRole = userData.value?.role || "EMPLOYEE";
  const unapprovedCount = unapprovedProfiles.value?.length ?? 0;

  // Signal to control mobile popup menu visibility
  const isMobileMenuOpen = useSignal(false);

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
      isRedBadge: unapprovedCount > 0,
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
      id: "job-profiles",
      label: "Job Profiles",
      href: "/job-profiles/",
      icon: IconChecklist,
      roles: ["ADMIN"],
    },
    {
      id: "user-management",
      label: "User Management",
      href: "/user-management/",
      icon: IconUsers,
      roles: ["ADMIN"],
    },
    {
      id: "profile",
      label: "Profile",
      href: "/profile/",
      icon: IconUsers,
      roles: ["TEAM LEAD", "EMPLOYEE"],
    },
    {
      id: "teams",
      label: "Teams",
      href: "/teams/",
      icon: IconTeams,
      roles: ["ADMIN"],
    },
  ];

  // Filter routes based on role
  const filteredNavConfig = navigationConfig.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  // Mobile Bottom items: First 4 pinned, remaining items accessible via "More Options"
  const mobileBottomItems = filteredNavConfig.slice(0, 4);
  const mobileMoreItems = filteredNavConfig.slice(4);

  // Check if any item inside the overflow menu is currently active
  const isMoreActive = mobileMoreItems.some((item) => location.url.pathname === item.href);

  const handleSignOut = $(async () => {
    document.cookie = "cerm_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    await nav("/");
  });

  return (
    <div class="min-h-[100dvh] bg-slate-100 text-gray-900 font-sans flex flex-col h-[100dvh] overflow-hidden">
      {/* Top Header Bar */}
      <header class="h-16 px-4 md:px-6 flex items-center justify-between bg-transparent flex-shrink-0 z-30">
        <Link
          href="/dashboard/"
          class="flex items-center gap-3 text-green-700 font-bold text-xl tracking-tight cursor-pointer"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
            <img src="/logo.webp" alt="Amend Logo" class="w-full h-full object-cover" />
          </div>
          <span class="text-gray-900 font-extrabold text-xl">
            <span class="text-green-600">Amend</span> Portal
          </span>
        </Link>

        {/* Header Actions */}
        <div class="flex items-center gap-2 md:gap-3">
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

        {/* Desktop Expand-on-Hover Left Sidebar: Vertically centered around height midpoint */}
        <aside class="hidden md:flex group absolute top-0 left-0 bottom-0 z-40 w-20 hover:w-64 transition-all duration-300 ease-in-out py-4 pl-3 pr-3 flex-col justify-center gap-2 overflow-hidden bg-slate-100/95 backdrop-blur-md hover:shadow-2xl border-none">
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

        {/* Dynamic Main Workspace Container with Dynamic CSS Calc Padding */}
        <main class="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex flex-col items-center">
          {/* pb-[calc(4rem+env(safe-area-inset-bottom)+2rem)] dynamically accounts for the 16 (4rem) mobile navbar height plus safe areas */}
          <div class="w-full max-w-5xl pb-[calc(4rem+env(safe-area-inset-bottom)+3rem)] md:pb-6">
            <Slot />
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav class="fixed bottom-0 left-0 right-0 h-16 pb-[env(safe-area-inset-bottom)] bg-slate-100/95 backdrop-blur-md border-t border-gray-200/80 flex items-center justify-center gap-4 px-4 z-50 md:hidden shadow-lg">
          {/* First 4 Navigation Items */}
          {mobileBottomItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.url.pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick$={() => (isMobileMenuOpen.value = false)}
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

          {/* Rightmost Action Button: Toggles Floating Nav Popup Space */}
          <div class="relative">
            <button
              onClick$={() => (isMobileMenuOpen.value = !isMobileMenuOpen.value)}
              class={`flex flex-col items-center justify-center p-2 rounded-xl text-gray-600 transition-all ${
                isMoreActive || isMobileMenuOpen.value ? "text-green-600 scale-110 font-bold" : ""
              }`}
              title="More Navigation Options"
            >
              <IconDotsVertical class="w-6 h-6" />
            </button>

            {/* Floating Popover UI Space for Remaining Actions */}
            {isMobileMenuOpen.value && (
              <>
                {/* Backdrop to dismiss menu when clicking outside */}
                <div
                  class="fixed inset-0 z-40"
                  onClick$={() => (isMobileMenuOpen.value = false)}
                />

                <div class="absolute right-0 bottom-14 z-50 min-w-[190px] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 border-b border-slate-100 mb-1">
                    More Options
                  </span>

                  {mobileMoreItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.url.pathname === item.href;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick$={() => (isMobileMenuOpen.value = false)}
                        class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-green-600 text-white font-bold shadow-sm"
                            : "text-gray-700 hover:bg-slate-100 active:bg-slate-200"
                        }`}
                      >
                        <div class="relative flex-shrink-0">
                          <IconComponent class={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                          {item.badge !== undefined && item.badge > 0 && (
                            <span
                              class={`absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[14px] h-3.5 rounded-full text-[9px] font-bold leading-none flex items-center justify-center ${
                                item.isRedBadge
                                  ? "bg-rose-500 text-white"
                                  : "bg-slate-200 text-slate-800"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span class="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
});