import { component$, useSignal } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { ViewModal } from "./view-modal";
import { DayJobsPopover } from "./day-jobs-popover";

interface CalendarDayCellProps {
  dayNumber: number;
  dayOfWeek: number;
  dateKey: string; // e.g., "2026-10-29"
  isToday: boolean;
  jobs: Job[];
  teamsMap: Map<number, Team>;
  deleteAction: any;
  onEditJob$: (job: Job) => void;
  onCreateJob$: (dateKey: string) => void;
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
    const isPopoverOpen = useSignal(false);
    const style = gridColumnStart ? { gridColumnStart } : undefined;

    // Group jobs by team ID for mobile counts
    const teamCounts = (() => {
      const countsMap = new Map<number | string, { count: number; color: string }>();
      for (const job of jobs) {
        const teamKey = job.team_id ?? "unassigned";
        const team = job.team_id ? teamsMap.get(job.team_id) : null;
        const color = team?.team_color || "#6B7280"; // Default gray for unassigned

        if (!countsMap.has(teamKey)) {
          countsMap.set(teamKey, { count: 0, color });
        }
        countsMap.get(teamKey)!.count += 1;
      }
      return Array.from(countsMap.values());
    })();

    return (
      <>
        {/* ================= MOBILE VIEW (Visible on max-sm, hidden on sm+) ================= */}
        <div style={style} class="sm:hidden">
          <div
            onClick$={() => {
              if (jobs.length > 0) {
                isPopoverOpen.value = true;
              } else {
                onCreateJob$(dateKey);
              }
            }}
            class="min-h-[75px] p-2 bg-white rounded-xl border border-gray-200/70 shadow-2xs transition flex flex-col items-center justify-center gap-1.5 cursor-pointer active:bg-slate-50"
          >
            {/* Perfectly centered day number */}
            <span
              class={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full leading-none ${isToday ? "bg-emerald-600 text-white shadow-xs" : "text-gray-700 bg-slate-100"
                }`}
            >
              {dayNumber}
            </span>

            {/* Perfectly centered team counts container */}
            {jobs.length > 0 ? (
              <div class="flex items-center justify-center gap-1 flex-wrap">
                {teamCounts.map((tc, idx) => (
                  <span
                    key={idx}
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white min-w-[18px] text-center leading-none shadow-2xs"
                    style={{ backgroundColor: tc.color }}
                  >
                    {tc.count}
                  </span>
                ))}
              </div>
            ) : (
              <div class="h-3" /> /* Maintains uniform cell vertical alignment */
            )}
          </div>

          {/* Centered Popover Card */}
          {isPopoverOpen.value && (
            <DayJobsPopover
              dateKey={dateKey}
              jobs={jobs}
              teamsMap={teamsMap}
              onClose$={() => (isPopoverOpen.value = false)}
              onSelectJob$={(job) => {
                selectedJobForView.value = job;
              }}
              onCreateJob$={(dateKey) => onCreateJob$(dateKey)}
            />
          )}
        </div>

        {/* ================= DESKTOP VIEW (Hidden on max-sm, visible on sm+) ================= */}
        <div
          style={style}
          onClick$={() => onCreateJob$(dateKey)}
          class="hidden sm:flex min-h-[140px] lg:min-h-[170px] p-3 bg-white rounded-lg border border-gray-100 transition flex-col cursor-pointer hover:border-green-300 hover:shadow-xs"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span
              class={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? "bg-emerald-600 text-white" : "text-gray-700"
                }`}
            >
              {dayNumber}
            </span>
            {jobs.length > 0 && (
              <span class="text-xs font-medium text-gray-400">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
              </span>
            )}
          </div>

          <div class="space-y-1 overflow-y-auto max-h-[120px] flex-1">
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
                    e.stopPropagation();
                    selectedJobForView.value = job;
                  }}
                  class="px-2 py-1 text-xs font-medium leading-tight rounded border-l-2 transition truncate cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: bgTint,
                    borderLeftColor: teamColor,
                  }}
                  title={`${customerName}${hasValidService ? ` - ${serviceType}` : ""}`}
                >
                  <span class="font-semibold block truncate" style={{ color: teamColor }}>
                    {customerName}
                  </span>
                  {hasValidService && (
                    <span class="block text-[10px] text-gray-500 truncate">
                      {serviceType}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* View Modal for Desktop Job Chips or Popover Selection */}
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