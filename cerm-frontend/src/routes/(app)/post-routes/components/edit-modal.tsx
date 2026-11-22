import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Service } from "~/hooks/amend-api-handling";
import { IconX } from "../../../../components/ui/icons";
import { useNotification } from "~/components/ui/notification-toast";
import { parseServices } from "~/utils/service-utils";
import { ServicesChecklist } from "~/components/ui/services-checklist";

interface EditModalProps {
  job: Job;
  availableServices?: Service[];
  updateAction: any;
  onClose$: PropFunction<() => void>;
}

export const EditModal = component$(({ job, availableServices = [], updateAction, onClose$ }: EditModalProps) => {
  const initialDate = job.scheduled_day ? job.scheduled_day.split("T")[0] : "";
  const scheduledDayInput = useSignal(initialDate);
  const notesInput = useSignal(job.notes || "");
  const isSubmitting = useSignal(false);
  const errorMessage = useSignal("");

  const notify = useNotification();

  const jobServices = parseServices(job.services_requested);
  const selectedServices = useSignal<Record<string, boolean>>(jobServices);

  // Use master service list names if available, otherwise fallback to existing keys
  const serviceKeys = availableServices.length > 0
    ? availableServices.map((s) => s.name)
    : Object.keys(selectedServices.value);

  const handleSubmit = $(async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    notify.loading("Updating scheduled job...");
    onClose$();

    try {
      const res = await updateAction.submit({
        id: job.id,
        team_id: job.team_id,
        name: job.name,
        email: job.email,
        phone_number: job.phone_number,
        address: job.address,
        job_payout: job.job_payout,
        scheduled_day: scheduledDayInput.value,
        start_time: job.start_time,
        end_time: job.end_time,
        completed: job.completed,
        notes: notesInput.value,
        completed_notes: job.completed_notes,
        services_requested: selectedServices.value,
      });

      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        notify.success("Job updated successfully!");
      } else {
        notify.error(res?.value?.message || "Failed to update job.");
      }
    } catch {
      notify.error("Network error. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  });

  const customerName = job.name?.trim() || `Job #${job.id}`;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick$={onClose$}
          disabled={isSubmitting.value}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
        >
          <IconX class="w-5 h-5" />
        </button>

        <h3 class="text-2xl font-extrabold text-gray-900 mb-1">Edit Job Schedule</h3>
        <p class="text-xs text-gray-500 mb-6">Update schedule, services, and notes for <strong>{customerName}</strong>.</p>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        <div class="space-y-5 mb-6">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Scheduled Date *</label>
            <input
              type="date"
              required
              value={scheduledDayInput.value}
              onInput$={(e) => (scheduledDayInput.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Requested Services Checklist (Using availableServices) */}
          <ServicesChecklist
            services={selectedServices}
            availableServiceKeys={serviceKeys}
            label="Requested Services for This Job"
          />

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Job Specific Notes (Visible to Crew)</label>
            <textarea
              rows={3}
              value={notesInput.value}
              onInput$={(e) => (notesInput.value = (e.target as HTMLTextAreaElement).value)}
              placeholder="Add job instructions or notes..."
              class="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value}
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={isSubmitting.value}
            class="min-w-[130px] h-[42px] px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting.value ? "Updating..." : "Update Job"}</span>
          </button>
        </div>
      </div>
    </div>
  );
});