import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import { IconX } from "../../../../components/ui/icons";
import { useNotification } from "~/components/ui/notification-toast";

interface CompleteJobModalProps {
  jobTitle: string;
  onClose$: PropFunction<() => void>;
  onConfirm$: PropFunction<(notes: string) => any | Promise<any>>;
}

export const CompleteJobModal = component$<CompleteJobModalProps>(({
  jobTitle,
  onClose$,
  onConfirm$,
}) => {
  const notesSignal = useSignal("");
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);

  const notify = useNotification();

  const handleSubmit$ = $(async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    notify.loading("Completing job...");
    onClose$();

    try {
      const res = await onConfirm$(notesSignal.value.trim());
      const isOk = res?.status === 200 || res?.value?.success || res === true;

      if (isOk) {
        notify.success("Job marked as complete!");
      } else {
        notify.error("Failed to complete job.");
      }
    } catch (err) {
      console.error(err);
      notify.error("Network error. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div
      class="fixed inset-0 z-50 flex items-start justify-center p-3 pt-[75px] sm:pt-20 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick$={(e) => {
        if (e.target === e.currentTarget && !isSubmitting.value && !isSuccess.value) {
          onClose$();
        }
      }}
    >
      <div
        class="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 relative max-h-[85dvh] flex flex-col animate-in fade-in slide-in-from-top-4 duration-200"
        onClick$={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 flex-shrink-0">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Complete Job
            </span>
            <h3 class="text-base font-extrabold text-gray-900 truncate max-w-[260px]">
              {jobTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value || isSuccess.value}
            class="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
          >
            <IconX class="w-5 h-5" />
          </button>
        </div>

        {/* Text Area */}
        <div class="mb-4 flex-1">
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Completion Notes <span class="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add any notes about work completed, materials used, or client sign-off..."
            value={notesSignal.value}
            disabled={isSubmitting.value || isSuccess.value}
            onInput$={(e) => (notesSignal.value = (e.target as HTMLTextAreaElement).value)}
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 text-sm text-gray-800 transition resize-none disabled:opacity-60"
          />
        </div>

        {/* Footer Actions */}
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value || isSuccess.value}
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit$}
            disabled={isSubmitting.value}
            class="min-w-[170px] h-[42px] px-4.5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting.value ? "Completing..." : "End Job, Mark Complete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
});