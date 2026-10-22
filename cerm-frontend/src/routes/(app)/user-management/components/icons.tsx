import { component$ } from "@builder.io/qwik";

export const IconX = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));