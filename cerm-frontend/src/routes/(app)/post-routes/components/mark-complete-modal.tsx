import { component$, useSignal, useComputed$, $, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import { IconX } from "../../../../components/ui/icons";

interface MarkCompleteModalProps {
  job: Job;
  updateAction: any;
  onClose$: PropFunction<() => void>;
  onSuccess$: PropFunction<() => void>;
}

export const MarkCompleteModal = component$<MarkCompleteModalProps>(({
  job,
  updateAction,
  onClose$,
  onSuccess$,
}) => {
  const isSubmitting = useSignal(false);
  const errorMessage = useSignal("");

  const scheduledDate = job.scheduled_day ? job.scheduled_day.split("T")[0] : new Date().toISOString().split("T")[0];

  // Helper to extract HH:mm from ISO or fallback to default
  const getTimePart = (isoString?: string | null, defaultHour = "09:00") => {
    if (!isoString) return defaultHour;
    try {
      const d = new Date(isoString);
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${mins}`;
    } catch {
      return defaultHour;
    }
  };

  const startTimeSignal = useSignal(getTimePart(job.start_time, "09:00"));
  const endTimeSignal = useSignal(getTimePart(job.end_time, "11:30"));
  const completedNotesSignal = useSignal(job.completed_notes || "");

  // Real-time validation: End time cannot be before or equal to start time
  const isTimeInvalid = useComputed$(() => {
    if (!startTimeSignal.value || !endTimeSignal.value) return false;
    return endTimeSignal.value <= startTimeSignal.value;
  });

  const handleMarkComplete = $(async () => {
    if (isSubmitting.value) return;
    errorMessage.value = "";

    if (!startTimeSignal.value || !endTimeSignal.value) {
      errorMessage.value = "Both start time and end time are required.";
      return;
    }

    if (endTimeSignal.value <= startTimeSignal.value) {
      errorMessage.value = "End time cannot be before or equal to the start time on that day.";
      return;
    }

    // Combine scheduled date with selected time to create RFC3339 timestamps
    const startDateTime = new Date(`${scheduledDate}T${startTimeSignal.value}:00`).toISOString();
    const endDateTime = new Date(`${scheduledDate}T${endTimeSignal.value}:00`).toISOString();

    isSubmitting.value = true;
    try {
      const res = await updateAction.submit({
        id: job.id,
        job_profile_id: job.job_profile_id,
        team_id: job.team_id ? Number(job.team_id) : null,
        scheduled_day: scheduledDate,
        start_time: startDateTime,
        end_time: endDateTime,
        completed: true,
        notes: job.notes ?? null,
        completed_notes: completedNotesSignal.value.trim() || null,
      });

      const isOk = res?.status === 200 || res?.value?.success;
      if (isOk) {
        onSuccess$();
      } else {
        isSubmitting.value = false;
        errorMessage.value = res?.value?.message || "Failed to mark job as complete.";
      }
    } catch {
      isSubmitting.value = false;
      errorMessage.value = "Network error. Please try again.";
    }
  });

  return (
    <div class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick$={onClose$}
          disabled={isSubmitting.value}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
          title="Close Modal"
        >
          <IconX class="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div class="mb-5 pr-8">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            Finalize Job
          </span>
          <h3 class="text-xl font-extrabold text-gray-900 mt-0.5">Mark Job as Complete</h3>
          <p class="text-xs text-gray-500 mt-1">
            Specify the start and end times and add any notes regarding job completion.
          </p>
        </div>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        <div class="space-y-4">
          {/* Start and End Time Selectors */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTimeSignal.value}
                onInput$={(e) => {
                  startTimeSignal.value = (e.target as HTMLInputElement).value;
                }}
                class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 text-sm font-semibold text-gray-800 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                End Time
              </label>
              <input
                type="time"
                min={startTimeSignal.value}
                value={endTimeSignal.value}
                onInput$={(e) => {
                  endTimeSignal.value = (e.target as HTMLInputElement).value;
                }}
                class={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none text-sm font-semibold text-gray-800 transition ${
                  isTimeInvalid.value
                    ? "border-red-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                }`}
              />
              {isTimeInvalid.value && (
                <span class="block text-[11px] font-semibold text-red-600 mt-1">
                  End time cannot be before or at start time.
                </span>
              )}
            </div>
          </div>

          {/* Completion Notes Section */}
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Job Completion Notes
            </label>
            <textarea
              rows={4}
              placeholder="Add details, materials used, client sign-off or handover notes..."
              value={completedNotesSignal.value}
              onInput$={(e) => (completedNotesSignal.value = (e.target as HTMLTextAreaElement).value)}
              class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 text-sm text-gray-800 transition resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div class="flex items-center justify-end gap-2.5 pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value}
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleMarkComplete}
            disabled={isSubmitting.value || isTimeInvalid.value}
            class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-sm ring-2 ring-green-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting.value ? "Saving..." : "Confirm & Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
});