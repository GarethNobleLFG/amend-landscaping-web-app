import { component$, useSignal } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { ViewModal } from "./view-modal";

interface CalendarDayCellProps {
  dayNumber: number;
  dayOfWeek: number;
  dateKey: string; // e.g., "2026-10-29"
  isToday: boolean;
  jobs: Job[];
  teamsMap: Map<number, Team>;
  deleteAction: any;
  onEditJob$: (job: Job) => void;
  onCreateJob$: (dateKey: string) => void; // Handler to trigger create modal
  gridColumnStart?: number;
}

// Helper converter
function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const CalendarDayCell = component$<CalendarDayCellProps>(
  ({ dayNumber, dateKey, isToday, jobs, teamsMap, deleteAction, onEditJob$, onCreateJob$, gridColumnStart }) => {
    const selectedJobForView = useSignal<Job | null>(null);
    const style = gridColumnStart ? { gridColumnStart } : undefined;

    return (
      <>
        <div
          style={style}
          onClick$={() => onCreateJob$(dateKey)} // Click cell background to open Create modal
          className="min-h-[110px] sm:min-h-[140px] lg:min-h-[170px] p-2 sm:p-3 bg-white rounded-lg border border-gray-100 transition flex flex-col cursor-pointer hover:border-green-300 hover:shadow-xs"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                isToday ? "bg-emerald-600 text-white" : "text-gray-700"
              }`}
            >
              {dayNumber}
            </span>
            {jobs.length > 0 && (
              <span className="text-[10px] sm:text-xs font-medium text-gray-400">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
              </span>
            )}
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[80px] sm:max-h-[120px] flex-1">
            {jobs.map((job) => {
              const customerName = job.job_profile?.name || `Profile #${job.job_profile_id}`;
              const serviceType = job.job_profile?.services_requested;
              const hasValidService = typeof serviceType === "string" && serviceType.trim().length > 0;

              const team = job.team_id ? teamsMap.get(job.team_id) : null;
              const teamColor = team?.team_color || "#3B82F6";
              const bgTint = hexToRgba(teamColor, 0.12);

              return (
                <div
                  key={job.id}
                  onClick$={(e) => {
                    e.stopPropagation(); // Prevent cell click from firing when clicking a job chip
                    selectedJobForView.value = job;
                  }}
                  className="px-2 py-1 text-[11px] sm:text-xs font-medium leading-tight rounded border-l-2 transition truncate cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: bgTint,
                    borderLeftColor: teamColor,
                  }}
                  title={`${customerName}${hasValidService ? ` - ${serviceType}` : ""}`}
                >
                  <span className="font-semibold block truncate" style={{ color: teamColor }}>
                    {customerName}
                  </span>
                  {hasValidService && (
                    <span className="block text-[10px] text-gray-500 truncate">
                      {serviceType}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedJobForView.value && (
          <ViewModal
            job={selectedJobForView.value}
            teamsMap={teamsMap}
            deleteAction={deleteAction}
            onClose$={() => (selectedJobForView.value = null)}
            onEdit$={(job) => onEditJob$(job)}
          />
        )}
      </>
    );
  }
);