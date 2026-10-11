import { component$ } from "@builder.io/qwik";

export const IconEye = component$((props: { class?: string }) => (
  <svg class={props.class || "w-4 h-4"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
));

export const IconPencil = component$((props: { class?: string }) => (
  <svg class={props.class || "w-4 h-4"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
));

export const IconTrash = component$((props: { class?: string }) => (
  <svg class={props.class || "w-4 h-4"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
));

export const IconX = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));