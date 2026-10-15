import { component$, type Signal, type PropFunction, useSignal, $ } from "@builder.io/qwik";
import type { JobProfile } from "../../hooks/job-profile-handling";

interface DeleteModalProps {
  profile: JobProfile;
  customMessage?: Signal<string>;
  text?: string;
  onClose$: PropFunction<() => void>;
  onConfirm$: PropFunction<() => void>;
}

export const DeleteModal = component$<DeleteModalProps>(({
  profile,
  customMessage,
  text = "Delete Profile",
  onClose$,
  onConfirm$,
}) => {
  const step = useSignal<"confirm" | "message">("confirm");
  const localCustomMessage = useSignal(customMessage?.value || "");
  const isSubmitting = useSignal(false);

  const handleConfirm$ = $(async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    // Sync local message back to parent signal if provided
    if (customMessage) {
      customMessage.value = localCustomMessage.value;
    }

    try {
      await onConfirm$();
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        {step.value === "confirm" ? (
          <>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{text}</h3>
            <p class="text-sm text-gray-600 mb-6">
              Are you sure you want to deny and remove <strong class="text-gray-900">{profile.name}</strong>? This action cannot be undone.
            </p>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                onClick$={onClose$}
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick$={() => (step.value = "message")}
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                Next: Add Denial Message
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Custom Denial Message */
          <div class="space-y-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-rose-600">
                Step 2 of 2
              </span>
              <h3 class="text-lg font-bold text-gray-900 mt-0.5">
                Add Denial Message
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Include an optional custom reason for denial to send to{" "}
                <strong class="text-gray-900">{profile.email}</strong>.
              </p>
            </div>

            <textarea
              value={localCustomMessage.value}
              onInput$={(e) => {
                const val = (e.target as HTMLTextAreaElement).value;
                localCustomMessage.value = val;
                if (customMessage) customMessage.value = val;
              }}
              placeholder="e.g. Unfortunately, this location falls slightly outside our current service radius this season."
              class="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none resize-y bg-slate-50"
            />

            <div class="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick$={() => (step.value = "confirm")}
                disabled={isSubmitting.value}
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick$={handleConfirm$}
                disabled={isSubmitting.value}
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting.value ? "Sending..." : "Send Denial Email & Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});