import { component$ } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";

interface CompletedDetailsCardProps {
  job: Job;
}

export const CompletedDetailsCard = component$<CompletedDetailsCardProps>(({ job }) => {
  // Compute total duration taken to complete
  const getDurationString = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null;
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    if (isNaN(diffMs) || diffMs < 0) return null;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const durationStr = getDurationString(job.start_time, job.end_time);

  return (
    <div class="bg-white rounded-3xl w-full lg:w-80 p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 self-start">
      {/* Header Badge */}
      <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Job Outcome
          </span>
          <h4 class="text-base font-extrabold text-gray-900 mt-0.5">Completion Details</h4>
        </div>
        <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100/80 text-emerald-900 tracking-wider">
          Done
        </span>
      </div>

      {/* Completion Time & Elapsed Info */}
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          Duration & Schedule
        </h5>
        <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-2.5 text-xs">
          {durationStr && (
            <div class="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <span class="text-gray-500 font-medium">Time Taken</span>
              <span class="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                ⏱ {durationStr}
              </span>
            </div>
          )}

          <div>
            <span class="block text-gray-500 font-medium mb-0.5">Start Time</span>
            <span class="font-semibold text-gray-900">
              {job.start_time
                ? new Date(job.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "N/A"}
            </span>
          </div>

          <div>
            <span class="block text-gray-500 font-medium mb-0.5">Finish Time</span>
            <span class="font-semibold text-gray-900">
              {job.end_time
                ? new Date(job.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Completed Notes */}
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Completion Notes
        </h5>
        <div class="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/60 text-xs text-gray-800 whitespace-pre-wrap min-h-[90px]">
          {job.completed_notes?.trim() ? (
            job.completed_notes
          ) : (
            <span class="text-gray-400 italic">No completion notes submitted for this job.</span>
          )}
        </div>
      </div>
    </div>
  );
});