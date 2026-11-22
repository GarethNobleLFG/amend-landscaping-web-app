import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { IconX, IconEdit, IconTrash } from "../../../../components/ui/icons";
import { CompletedDetailsCard } from "./completed-details-card";
import { MarkCompleteModal } from "./mark-complete-modal";
import { useNotification } from "~/components/ui/notification-toast";
import { parseServices } from "~/utils/service-utils";
import { ServicesList } from "~/components/ui/services-list";

interface ViewModalProps {
  job: Job;
  teamsMap: Map<number, Team>;
  deleteAction: any;
  updateAction?: any;
  onClose$: PropFunction<() => void>;
  onEdit$: PropFunction<(job: Job) => void>;
}

export const ViewModal = component$<ViewModalProps>(({
  job,
  teamsMap,
  deleteAction,
  updateAction,
  onClose$,
  onEdit$,
}) => {
  const isDeleting = useSignal(false);
  const errorMessage = useSignal("");
  const isMarkCompleteOpen = useSignal(false);
  const notify = useNotification();

  const isCompleted = Boolean(job.completed);
  const customerName = job.name?.trim() || `Job #${job.id}`;
  const fullAddress = job.address?.trim() ? job.address : "N/A";

  const team = job.team_id ? teamsMap.get(job.team_id) : null;
  const teamColor = team?.team_color || "#3B82F6";

  const resolvedServices = parseServices(job.services_requested);

  const handleDelete = $(async () => {
    if (isDeleting.value) return;
    isDeleting.value = true;
    errorMessage.value = "";
    notify.loading("Deleting scheduled job...");
    onClose$();

    try {
      const res = await deleteAction.submit({ id: job.id });
      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        notify.success("Job deleted successfully!");
      } else {
        const msg = res?.value?.message || "Failed to delete job";
        errorMessage.value = msg;
        notify.error(msg);
      }
    } catch {
      const msg = "Network error. Please try again.";
      errorMessage.value = msg;
      notify.error(msg);
    } finally {
      isDeleting.value = false;
    }
  });

  return (
    <>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        {/* Main View Modal Wrapper (Always stays centered and locked at max-w-2xl) */}
        <div class="relative max-w-2xl w-full my-auto">
          {/* Main View Modal Card */}
          <div class="bg-white rounded-3xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick$={onClose$}
              disabled={isDeleting.value}
              class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
              title="Close Modal"
            >
              <IconX class="w-5 h-5" />
            </button>

            {errorMessage.value && (
              <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMessage.value}
              </div>
            )}

            {/* Header with Name & Team Color/Schedule Badge */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 pr-8">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Scheduled Job
                </span>
                <div class="flex items-center gap-2.5 mt-0.5">
                  <h3 class={`text-2xl font-extrabold break-words ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {customerName}
                  </h3>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full text-white shadow-xs"
                  style={{ backgroundColor: teamColor }}
                >
                  {team ? team.name : "Unassigned Team"}
                </span>
                <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
                  {job.scheduled_day ? new Date(job.scheduled_day).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            {/* Information Section */}
            <div class="mb-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Job Snapshot Details
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Email</span>
                  <span class="text-gray-900 font-medium break-all">{job.email || "N/A"}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Phone Number</span>
                  <span class="text-gray-900 font-medium">{job.phone_number || "N/A"}</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Address</span>
                  <span class="text-gray-900 font-medium break-words">{fullAddress}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Job Payout</span>
                  <span class="text-gray-900 font-medium">
                    {job.job_payout != null
                      ? `$${Number(job.job_payout).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Requested Services Section (Refactored Shared Component) */}
            <div class="mb-6">
              <ServicesList
                services={resolvedServices}
                title="Requested Services for This Job"
              />
            </div>

            {/* Job Notes Section */}
            <div class="mb-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Job Notes
              </h4>
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{job.notes || "N/A"}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
              <button
                type="button"
                onClick$={onClose$}
                disabled={isDeleting.value}
                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>

              <div class="flex items-center gap-2.5 flex-wrap">
                {!isCompleted && updateAction && (
                  <button
                    type="button"
                    onClick$={() => (isMarkCompleteOpen.value = true)}
                    disabled={isDeleting.value}
                    class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-sm ring-2 ring-green-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✓ Mark Complete</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick$={() => {
                    onClose$();
                    onEdit$(job);
                  }}
                  disabled={isDeleting.value}
                  class="px-4.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-sm ring-2 ring-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <IconEdit class="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick$={handleDelete}
                  disabled={isDeleting.value}
                  class="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <IconTrash class="w-4 h-4" />
                  <span>{isDeleting.value ? "Deleting..." : "Delete Job"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right-Side Completed Details Card */}
          {isCompleted && (
            <div class="mt-4 lg:mt-0 lg:absolute lg:left-[calc(100%+1rem)] lg:top-0 lg:w-80 w-full pointer-events-auto">
              <CompletedDetailsCard job={job} />
            </div>
          )}
        </div>
      </div>

      {/* Mark Complete Sub-Modal */}
      {isMarkCompleteOpen.value && (
        <MarkCompleteModal
          job={job}
          updateAction={updateAction}
          onClose$={() => (isMarkCompleteOpen.value = false)}
          onSuccess$={() => {
            isMarkCompleteOpen.value = false;
            onClose$();
          }}
        />
      )}
    </>
  );
});