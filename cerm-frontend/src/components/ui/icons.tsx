import { component$ } from "@builder.io/qwik";

export const IconPlus = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
));

export const IconTrash = component$((props: { class?: string }) => (
  <svg class={props.class || "w-4 h-4"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
));

export const IconEdit = component$((props: { class?: string }) => (
  <svg class={props.class || "w-4 h-4"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
));

export const IconX = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));

export const IconLogOut = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
));

export const IconIntake = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 17V3" />
    <path d="m6 11 6 6 6-6" />
    <path d="M19 21H5" />
  </svg>
));

export const IconSend = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
));

export const IconBell = component$((props: { class?: string }) => (
  <svg class={props.class || "w-6 h-6"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
));

export const IconDashboard = component$((props: { class?: string }) => (
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

export const IconUsers = component$((props: { class?: string }) => (
  <svg
    class={props.class || "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
));

export const IconTeams = component$((props: { class?: string }) => (
  <svg
    class={props.class || "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
));

export const IconDotsVertical = component$((props: { class?: string }) => (
  <svg
    class={props.class || "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
));
