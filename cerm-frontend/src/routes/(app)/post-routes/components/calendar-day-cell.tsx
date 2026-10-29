import { component$ } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";

interface CalendarDayCellProps {
  dayNumber: number;
  dayOfWeek: number;
  isToday: boolean;
  jobs: Job[];
  gridColumnStart?: number;
}

export const CalendarDayCell = component$<CalendarDayCellProps>(
  ({ dayNumber, isToday, jobs, gridColumnStart }) => {
    const style = gridColumnStart ? { gridColumnStart } : undefined;

    return (
      <div
        style={style}
        className="min-h-[110px] sm:min-h-[140px] lg:min-h-[170px] p-2 sm:p-3 bg-white rounded-lg border border-gray-100 transition flex flex-col"
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

        {/* Job Event Chips with Customer Profile Name */}
        <div className="space-y-1 overflow-y-auto max-h-[80px] sm:max-h-[120px] flex-1">
          {jobs.map((job) => {
            const customerName = job.job_profile?.name || `Profile #${job.job_profile_id}`;
            const serviceType = job.job_profile?.services_requested;
            const hasValidService = typeof serviceType === "string" && serviceType.trim().length > 0;

            return (
              <div
                key={job.id}
                className="px-2 py-1 text-[11px] sm:text-xs font-medium leading-tight rounded bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition truncate cursor-pointer"
                title={`${customerName}${hasValidService ? ` - ${serviceType}` : ""}`}
              >
                <span className="font-semibold block truncate">{customerName}</span>
                {hasValidService && (
                  <span className="block text-[10px] text-blue-500 truncate">
                    {serviceType}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);