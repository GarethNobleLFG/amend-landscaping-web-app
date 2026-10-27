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