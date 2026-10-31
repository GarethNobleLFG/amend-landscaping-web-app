import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { IconX, IconEdit, IconTrash } from "../../../../components/ui/icons";
import { CompletedDetailsCard } from "./completed-details-card";
import { MarkCompleteModal } from "./mark-complete-modal";

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

  const profile = job.job_profile || {};
  const isCommercial = Boolean((profile as any).is_commercial);
  const isCompleted = Boolean(job.completed);

  const hasAddress = (profile as any).address || (profile as any).city || (profile as any).state || (profile as any).zip;
  const fullAddress = hasAddress
    ? `${(profile as any).address || ""}, ${(profile as any).city || ""} ${(profile as any).state || ""} ${(profile as any).zip || ""}`.trim()
    : "N/A";

  const team = job.team_id ? teamsMap.get(job.team_id) : null;
  const teamColor = team?.team_color || "#3B82F6";

  const servicesObj = (profile as any).services_requested || (profile as any).services || (profile as any).requested_services || {};
  const activeServices: string[] = typeof servicesObj === "object" && servicesObj !== null
    ? Object.entries(servicesObj)
        .filter(([_, isEnabled]) => Boolean(isEnabled))
        .map(([serviceName]) => serviceName)
    : [];

  const handleDelete = $(async () => {
    if (isDeleting.value) return;
    isDeleting.value = true;
    errorMessage.value = "";

    try {
      const res = await deleteAction.submit({ id: job.id });
      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        onClose$();
      } else {
        isDeleting.value = false;
        errorMessage.value = res?.value?.message || "Failed to delete job";
      }
    } catch {
      isDeleting.value = false;
      errorMessage.value = "Network error. Please try again.";
    }
  });

  return (
    <>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
        {/* Compact balanced container */}
        <div class="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 max-w-4xl w-full max-h-[90vh]">
          {/* Main View Modal */}
          <div class="bg-white rounded-3xl flex-1 p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick$={onClose$}
              disabled={isDeleting.value}
              class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
              title="Close Modal"
            >
              <IconX class="w-5 h-5" />
            </button>

            {errorMessage.value && (
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMessage.value}
              </div>
            )}

            {/* Header: Preserves full original 2xl title */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100 pr-8">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {isCommercial ? "Commercial Job" : "Job"}
                </span>
                <div class="flex items-center gap-2.5 mt-0.5">
                  <h3 class={`text-2xl font-extrabold ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                    {(profile as any).name || `Profile #${job.job_profile_id}`}
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

            {/* Information Grid: Preserved text-sm text with tighter gap */}
            <div class="mb-5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                {isCommercial ? "Company Information" : "Information"}
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                    {isCommercial ? "Company Contact Email" : "Email"}
                  </span>
                  <span class="text-gray-900 font-medium break-all">{(profile as any).email || "N/A"}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                    {isCommercial ? "Business Phone" : "Phone Number"}
                  </span>
                  <span class="text-gray-900 font-medium">{(profile as any).phone_number || "N/A"}</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                    {isCommercial ? "Facility / Service Address" : "Address"}
                  </span>
                  <span class="text-gray-900 font-medium">{fullAddress}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Referral Info</span>
                  <span class="text-gray-900 font-medium">{(profile as any).referral_info || "N/A"}</span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                    {isCommercial ? "Contract Value" : "Average Job Payout"}
                  </span>
                  <span class="text-gray-900 font-medium">
                    {(profile as any).job_payout != null
                      ? `$${Number((profile as any).job_payout).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Requested Services: Preserved text-sm with compact vertical padding */}
            <div class="mb-5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                Requested Services
              </h4>
              <div class="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/60 text-sm">
                {activeServices.length > 0 ? (
                  <ul class="space-y-1.5">
                    {activeServices.map((service, idx) => (
                      <li key={idx} class="flex items-center gap-2.5 text-gray-900 font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span class="text-gray-500 italic text-sm">No services selected</span>
                )}
              </div>
            </div>

            {/* Notes Sections */}
            <div class="flex flex-col gap-3 mb-6">
              <div class="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/60">
                <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Job Notes
                </h4>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{job.notes || "N/A"}</p>
              </div>
              <div class="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/60">
                <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
                </h4>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{(profile as any).description || "N/A"}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-2">
              <button
                type="button"
                onClick$={onClose$}
                disabled={isDeleting.value}
                class="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>

              <div class="flex items-center gap-2 flex-wrap">
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
          {isCompleted && <CompletedDetailsCard job={job} />}
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