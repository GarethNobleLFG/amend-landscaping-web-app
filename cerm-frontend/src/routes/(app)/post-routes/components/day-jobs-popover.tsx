import { component$, type PropFunction } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { IconX, IconPlus } from "../../../../components/ui/icons";

interface DayJobsPopoverProps {
  dateKey: string; // YYYY-MM-DD
  jobs: Job[];
  teamsMap: Map<number, Team>;
  onClose$: PropFunction<() => void>;
  onSelectJob$: PropFunction<(job: Job) => void>;
  onCreateJob$: PropFunction<(dateKey: string) => void>;
}

export const DayJobsPopover = component$<DayJobsPopoverProps>(({
  dateKey,
  jobs,
  teamsMap,
  onClose$,
  onSelectJob$,
  onCreateJob$,
}) => {
  const formattedDate = new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Container with pointer-events enabled for the card itself */}
      <div class="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-200 relative max-h-[80vh] overflow-y-auto pointer-events-auto">
        <button
          onClick$={onClose$}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all cursor-pointer"
          title="Close"
        >
          <IconX class="w-5 h-5" />
        </button>

        {/* Header */}
        <div class="mb-4 pr-6">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">{formattedDate}</h4>
          <p class="text-base font-extrabold text-gray-900">
            {jobs.length} {jobs.length === 1 ? "Job Scheduled" : "Jobs Scheduled"}
          </p>
        </div>

        {/* Jobs List */}
        <div class="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const customerName = job.job_profile?.name || `Profile #${job.job_profile_id}`;
              const serviceType = job.job_profile?.services_requested;
              const hasValidService = typeof serviceType === "string" && serviceType.trim().length > 0;
              const team = job.team_id ? teamsMap.get(job.team_id) : null;
              const teamColor = team?.team_color || "#3B82F6";

              return (
                <div
                  key={job.id}
                  onClick$={() => {
                    onClose$();
                    onSelectJob$(job);
                  }}
                  class="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div
                      class="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: teamColor }}
                    />
                    <div class="min-w-0">
                      <span class="text-xs font-bold text-gray-900 truncate block">{customerName}</span>
                      {hasValidService && (
                        <p class="text-[11px] text-gray-500 truncate">{serviceType}</p>
                      )}
                    </div>
                  </div>
                  <span class="text-xs font-semibold text-green-600 flex-shrink-0">View</span>
                </div>
              );
            })
          ) : (
            <div class="text-center py-6 text-gray-400 text-xs italic">
              No jobs scheduled for this date.
            </div>
          )}
        </div>

        {/* Action Footer */}
        <button
          type="button"
          onClick$={() => {
            onClose$();
            onCreateJob$(dateKey);
          }}
          class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <IconPlus class="w-4 h-4" />
          <span>Add Job Here</span>
        </button>
      </div>
    </div>
  );
});