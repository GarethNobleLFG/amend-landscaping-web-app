import { component$, useSignal, $, Slot } from '@builder.io/qwik';

// ============================================================================
// 1. QWIK SVG ICON COMPONENTS (Zero External Dependencies)
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

const IconInbox = component$((props: { class?: string }) => (
    <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
));

const IconStar = component$((props: { class?: string }) => (
    <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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

// ============================================================================
// 2. QWIK SUB-VIEWS FOR APPLICATION AREA
// ============================================================================
const InboxView = component$(() => (
    <div class="space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Inbox & Customer Requests</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-6 bg-white/80 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Residential</span>
                <h3 class="font-bold text-gray-900 text-lg mt-3">Lawn Maintenance Request</h3>
                <p class="text-xs text-gray-400 mt-1">Today, 2:30 PM</p>
            </div>
            <div class="p-6 bg-white/80 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Commercial</span>
                <h3 class="font-bold text-gray-900 text-lg mt-3">Landscape Renovation</h3>
                <p class="text-xs text-gray-400 mt-1">Yesterday, 10:15 AM</p>
            </div>
        </div>
    </div>
));

const ContactsView = component$(() => (
    <div class="p-8 bg-white/80 rounded-2xl border border-gray-200/60 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Contacts Management</h2>
        <p class="text-gray-600 text-sm">Manage client contact cards, phone numbers, and addresses here.</p>
    </div>
));

const ServicesView = component$(() => (
    <div class="p-8 bg-white/80 rounded-2xl border border-gray-200/60 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Services Catalog</h2>
        <p class="text-gray-600 text-sm">Add, edit, or configure landscaping services and pricing tiers.</p>
    </div>
));

const GenericPlaceholderView = component$((props: { title: string }) => (
    <div class="p-8 bg-white/80 rounded-2xl border border-gray-200/60 shadow-sm text-center py-12">
        <h2 class="text-xl font-bold text-gray-900">{props.title} Component Area</h2>
        <p class="text-gray-500 text-sm mt-2">Plug in your custom Qwik component here for the {props.title} tab.</p>
    </div>
));

// ============================================================================
// 3. PLUG-AND-CHUG CONFIGURATION TABLE
// ============================================================================
const NAVIGATION_CONFIG = [
    {
        id: 'inbox',
        label: 'Inbox',
        icon: IconInbox,
        badge: 5,
        isRedBadge: true,
        view: InboxView
    },
    {
        id: 'starred',
        label: 'Starred',
        icon: IconStar,
        badge: 2,
        isRedBadge: false,
        view: component$(() => <GenericPlaceholderView title="Starred Requests" />)
    },
    {
        id: 'feedback',
        label: 'Feedback',
        icon: IconSend,
        badge: 3,
        isRedBadge: true,
        view: component$(() => <GenericPlaceholderView title="Client Feedback" />)
    },
    {
        id: 'contacts',
        label: 'Contacts',
        icon: IconUsers,
        badge: 0,
        view: ContactsView
    },
    {
        id: 'services',
        label: 'Services',
        icon: IconWrench,
        view: ServicesView
    },
    {
        id: 'pages',
        label: 'Pages',
        icon: IconLayers,
        view: component$(() => <GenericPlaceholderView title="Pages Manager" />)
    },
    {
        id: 'reviews',
        label: 'Reviews',
        icon: IconMessageSquare,
        view: component$(() => <GenericPlaceholderView title="Reviews & Testimonials" />)
    },
    {
        id: 'gallery',
        label: 'Image Gallery',
        icon: IconImageIcon,
        view: component$(() => <GenericPlaceholderView title="Gallery Uploads" />)
    },
    {
        id: 'archive',
        label: 'Archive',
        icon: IconArchive,
        badge: 12,
        isRedBadge: false,
        view: component$(() => <GenericPlaceholderView title="Archived Records" />)
    },
];

// Specify 4 item IDs for the mobile bottom bar (5th icon is auto "More")
const MOBILE_BOTTOM_ITEM_IDS = ['inbox', 'starred', 'feedback', 'contacts'];

// ============================================================================
// 4. MAIN QWIK DASHBOARD ROOT LAYOUT COMPONENT
// ============================================================================
export const AppLayout = component$(() => {
    const activeTab = useSignal('inbox');

    // Find active config item
    const currentNavItem = NAVIGATION_CONFIG.find(item => item.id === activeTab.value);
    const ActiveComponent = currentNavItem?.view;

    // Filter items for mobile bottom bar & "More" screen
    const mobileBottomItems = NAVIGATION_CONFIG.filter(item => MOBILE_BOTTOM_ITEM_IDS.includes(item.id));
    const mobileMoreItems = NAVIGATION_CONFIG.filter(item => !MOBILE_BOTTOM_ITEM_IDS.includes(item.id));

    const handleSignOut = $(() => {
        alert("Sign Out Triggered");
    });

    return (
        <div class="min-h-screen bg-slate-100 text-gray-900 font-sans flex flex-col h-screen overflow-hidden">
            
            {/* Top Header Bar */}
            <header class="h-16 px-4 md:px-6 flex items-center justify-between bg-transparent flex-shrink-0 z-30">
                {/* Brand Logo & Title */}
                <div
                    class="flex items-center gap-3 text-green-700 font-bold text-xl tracking-tight cursor-pointer"
                    onClick$={() => activeTab.value = 'inbox'}
                >
                    <div class="w-10 h-10 rounded-xl bg-green-200/60 flex items-center justify-center">
                        <IconClipboardList class="w-6 h-6 text-green-700" />
                    </div>
                    <span class="text-gray-900 font-extrabold text-xl">
                        CERM by <span class="text-green-600">Amend</span>
                    </span>
                </div>

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

                {/* Desktop Expand-on-Hover Left Sidebar (Hidden on Mobile) */}
                <aside class="hidden md:flex group absolute top-0 left-0 bottom-0 z-40 w-20 hover:w-64 transition-all duration-300 ease-in-out py-4 pl-3 pr-3 flex-col gap-2 overflow-hidden bg-slate-100/95 backdrop-blur-md hover:shadow-2xl border-none">
                    {NAVIGATION_CONFIG.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeTab.value === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick$={() => activeTab.value = item.id}
                                class={`w-full flex items-center gap-4 p-3.5 text-base font-semibold transition-all rounded-2xl ${
                                    isActive
                                        ? 'bg-green-600 text-white font-bold shadow-md shadow-green-600/20'
                                        : 'text-gray-700 hover:bg-gray-200/80 hover:text-gray-900'
                                }`}
                            >
                                {/* Nav Icon with Badge Overlay */}
                                <div class="flex-shrink-0 flex items-center justify-center relative">
                                    <IconComponent class={`w-7 h-7 ${isActive ? 'text-white' : 'text-gray-600'}`} />

                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span
                                            class={`absolute -top-2 -right-3 px-2 py-0.5 min-w-[22px] h-5 rounded-full text-xs font-bold leading-none flex items-center justify-center shadow-sm transition-colors ${
                                                item.isRedBadge
                                                    ? 'bg-rose-500 text-white'
                                                    : isActive
                                                    ? 'bg-white text-green-800'
                                                    : 'bg-slate-200/90 text-slate-700'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Label Revealed on Sidebar Hover */}
                                <span class="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden text-sm">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </aside>

                {/* Dynamic Main Workspace Container */}
                <main class="flex-1 overflow-y-auto px-4 md:px-6 py-4 flex justify-center pb-24 md:pb-6">
                    <div class="w-full max-w-5xl">
                        
                        {/* Render Active Tab Component or Route Slot */}
                        {activeTab.value === 'more' ? (
                            <div class="space-y-4">
                                <h2 class="text-xl font-bold text-gray-900 mb-4">All Management Tools</h2>
                                <div class="grid grid-cols-2 gap-4">
                                    {mobileMoreItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick$={() => activeTab.value = item.id}
                                                class="p-5 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/60 flex flex-col items-center justify-center gap-3 hover:bg-white active:scale-95 transition-all text-center"
                                            >
                                                <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                                                    <IconComponent class="w-7 h-7" />
                                                </div>
                                                <span class="font-bold text-gray-800 text-sm">{item.label}</span>
                                                {item.badge !== undefined && item.badge > 0 && (
                                                    <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                                                        {item.badge} items
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Render Active Component OR Route Slot */
                            ActiveComponent ? <ActiveComponent /> : <Slot />
                        )}

                    </div>
                </main>

                {/* Mobile Bottom Navigation Bar (Max 5 Icons) */}
                <nav class="fixed bottom-0 left-0 right-0 h-16 bg-slate-100/95 backdrop-blur-md border-t border-gray-200/80 flex items-center justify-around px-2 z-50 md:hidden shadow-lg">
                    {/* First 4 Primary Icons */}
                    {mobileBottomItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeTab.value === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick$={() => activeTab.value = item.id}
                                class={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
                                    isActive ? 'text-green-600 scale-110' : 'text-gray-600'
                                }`}
                            >
                                <div class="relative">
                                    <IconComponent class="w-6 h-6" />
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span
                                            class={`absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full text-[10px] font-bold leading-none flex items-center justify-center shadow-sm ${
                                                item.isRedBadge ? 'bg-rose-500 text-white' : 'bg-slate-300 text-slate-800'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}

                    {/* 5th Mobile Icon: "More" Tool Collection Button */}
                    <button
                        onClick$={() => activeTab.value = 'more'}
                        class={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                            activeTab.value === 'more' ? 'text-green-600 scale-110 font-bold' : 'text-gray-600'
                        }`}
                        title="More Tools"
                    >
                        <IconGrid class="w-6 h-6" />
                    </button>
                </nav>

            </div>
        </div>
    );
});
