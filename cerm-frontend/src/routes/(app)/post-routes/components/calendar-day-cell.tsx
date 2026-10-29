import { component$ } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling"; // Adjusted to match your hook type path if needed

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
        className="min-h-[120px] p-2 bg-white rounded-lg border border-gray-100 transition flex flex-col"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
              isToday ? "bg-blue-600 text-white" : "text-gray-700"
            }`}
          >
            {dayNumber}
          </span>
          {jobs.length > 0 && (
            <span className="text-[10px] font-medium text-gray-400">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
            </span>
          )}
        </div>

        {/* Job Event Chips */}
        <div className="space-y-1 overflow-y-auto max-h-[90px] flex-1">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="px-2 py-1 text-[11px] font-medium leading-tight rounded bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition truncate cursor-pointer"
              title={job.notes ?? `Job Profile #${job.job_profile_id}`}
            >
              <span className="font-semibold">#{job.id}</span> Prof #{job.job_profile_id}
              {job.team_id && <span className="ml-1 text-blue-500">(Team #{job.team_id})</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }
);