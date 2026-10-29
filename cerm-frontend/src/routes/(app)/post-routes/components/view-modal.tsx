import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { IconX, IconEdit, IconTrash } from "../../../../components/ui/icons";

interface ViewModalProps {
  job: Job;
  teamsMap: Map<number, Team>;
  deleteAction: any;
  onClose$: PropFunction<() => void>;
  onEdit$: PropFunction<(job: Job) => void>;
}

export const ViewModal = component$<ViewModalProps>(({ job, teamsMap, deleteAction, onClose$, onEdit$ }) => {
  const isDeleting = useSignal(false);
  const errorMessage = useSignal("");

  const profile = job.job_profile || {};
  const isCommercial = Boolean((profile as any).is_commercial);
  const hasAddress = (profile as any).address || (profile as any).city || (profile as any).state || (profile as any).zip;
  const fullAddress = hasAddress
    ? `${(profile as any).address || ""}, ${(profile as any).city || ""} ${(profile as any).state || ""} ${(profile as any).zip || ""}`.trim()
    : "N/A";

  const team = job.team_id ? teamsMap.get(job.team_id) : null;
  const teamColor = team?.team_color || "#3B82F6";

  // Extract requested services from profile.services_requested dictionary object where value is true
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
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick$={onClose$}
          disabled={isDeleting.value}
          class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50"
          title="Close Modal"
        >
          <IconX class="w-5 h-5" />
        </button>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        {/* Header with Name/Company Name & Team Color/Schedule Badge */}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
              {isCommercial ? "Commercial Job" : "Job"}
            </span>
            <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
              {(profile as any).name || `Profile #${job.job_profile_id}`}
            </h3>
          </div>
          <div class="flex items-center gap-2">
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
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            {isCommercial ? "Company Information" : "Information"}
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
            <div>
              <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                {isCommercial ? "Company Contact Email" : "Email"}
              </span>
              <span class="text-gray-900 font-medium">{(profile as any).email || "N/A"}</span>
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
            <div class="sm:col-span-2">
              <span class="block text-xs font-semibold text-gray-500 mb-0.5">Referral Info</span>
              <span class="text-gray-900 font-medium">{(profile as any).referral_info || "N/A"}</span>
            </div>
            <div class="sm:col-span-2">
              <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                {isCommercial ? "Contract / Service Value" : "Average Job Payout"}
              </span>
              <span class="text-gray-900 font-medium">
                {(profile as any).job_payout != null
                  ? `$${Number((profile as any).job_payout).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Requested Services Bullet Points Section */}
        <div class="mb-6">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Requested Services
          </h4>
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
            {activeServices.length > 0 ? (
              <ul class="space-y-2">
                {activeServices.map((service, idx) => (
                  <li key={idx} class="flex items-center gap-2.5 text-gray-900 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span class="text-gray-500 italic">No services selected</span>
            )}
          </div>
        </div>

        {/* Vertical Notes Sections */}
        <div class="flex flex-col gap-4 mb-8">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Job Notes
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{job.notes || "N/A"}</p>
          </div>
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{(profile as any).description || "N/A"}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isDeleting.value}
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick$={() => {
                onClose$();
                onEdit$(job);
              }}
              disabled={isDeleting.value}
              class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
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
    </div>
  );
});