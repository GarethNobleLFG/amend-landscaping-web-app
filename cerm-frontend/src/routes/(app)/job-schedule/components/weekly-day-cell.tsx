import { component$ } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";

interface WeeklyDayCellProps {
  dayDate: Date;
  isToday: boolean;
  jobs: Job[];
}

export const WeeklyDayCell = component$(({ dayDate, isToday, jobs }: WeeklyDayCellProps) => {
  const dayName = dayDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const dayNum = dayDate.getDate();

  return (
    <div class="flex flex-col items-center">
      <span class="text-xs sm:text-sm font-bold text-slate-400 mb-3 tracking-wider">
        {dayName}
      </span>

      <div class={[
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all shadow-xs mb-4",
        isToday ? "bg-emerald-600 text-white ring-4 ring-emerald-600/30" : "bg-white text-slate-700 border-2 border-emerald-300/80 hover:border-emerald-500"
      ]}>
        {dayNum}
      </div>

      <div class="w-full space-y-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            class="w-full bg-emerald-100/60 hover:bg-emerald-200/60 text-emerald-900 rounded-xl px-3 py-2 text-xs font-bold text-center cursor-pointer transition shadow-xs truncate"
            title={job.job_profile?.name ?? `Job #${job.id}`}
          >
            {job.job_profile?.name ?? `Job #${job.id}`}
          </div>
        ))}
      </div>
    </div>
  );
});