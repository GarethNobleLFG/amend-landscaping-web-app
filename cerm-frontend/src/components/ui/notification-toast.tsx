import { component$, createContextId, useContext, useContextProvider, useSignal, Slot, $, type Signal } from "@builder.io/qwik";

export type NotificationType = "loading" | "success" | "error" | "info";

export interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export const NotificationContext = createContextId<Signal<NotificationState>>("notification-context");

export const NotificationProvider = component$(() => {
  const notificationState = useSignal<NotificationState>({
    show: false,
    type: "info",
    message: "",
  });

  useContextProvider(NotificationContext, notificationState);

  return (
    <>
      <Slot />
      <NotificationToast />
    </>
  );
});

export const useNotification = () => {
  const state = useContext(NotificationContext);

  const show = $((type: NotificationType, message: string, autoCloseMs = 2500) => {
    state.value = { show: true, type, message };
    if (autoCloseMs > 0 && type !== "loading") {
      setTimeout(() => {
        state.value = { ...state.value, show: false };
      }, autoCloseMs);
    }
  });

  const loading = $((message = "Processing...") => {
    state.value = { show: true, type: "loading", message };
  });

  const success = $((message: string, autoCloseMs = 2500) => {
    show("success", message, autoCloseMs);
  });

  const error = $((message: string, autoCloseMs = 3500) => {
    show("error", message, autoCloseMs);
  });

  const close = $(() => {
    state.value = { ...state.value, show: false };
  });

  return { show, loading, success, error, close, state };
};

export const NotificationToast = component$(() => {
  const state = useContext(NotificationContext);
  const { close } = useNotification();

  if (!state.value.show) return null;

  const isError = state.value.type === "error";
  const isLoading = state.value.type === "loading";

  return (
    <>
      <style dangerouslySetInnerHTML={`
        @keyframes toast-slide-up {
          0% {
            transform: translateY(140%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .toast-animate-up {
          animation: toast-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `} />

      <div class="fixed right-6 bottom-20 md:bottom-6 z-50 pointer-events-none toast-animate-up">
        <div
          class={[
            "pointer-events-auto rounded-lg px-4 py-3 flex items-center gap-5 transition-all font-sans border-0 shadow-none",
            isError
              ? "bg-rose-100/80 text-rose-900"
              : "bg-slate-200 text-slate-800"
          ]}
        >
          <div class="flex items-center gap-3">
            {isLoading && (
              <div class="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin flex-shrink-0" />
            )}

            <span class="text-sm font-semibold whitespace-nowrap">
              {state.value.message}
            </span>
          </div>

          <button
            type="button"
            onClick$={close}
            class="text-slate-400 hover:text-slate-600 p-0.5 transition-colors cursor-pointer flex-shrink-0"
            title="Dismiss"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
});