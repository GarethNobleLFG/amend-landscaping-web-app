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
    <div class="flex flex-col items-center min-w-0">
      {/* Abbreviate weekday names to 1 letter on ultra-small screens if needed, or keep short */}
      <span class="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 mb-1.5 sm:mb-3 tracking-wider truncate">
        {dayName}
      </span>

      <div class={[
        "w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-xs sm:text-lg md:text-xl transition-all shadow-xs mb-2 sm:mb-4 shrink-0",
        isToday ? "bg-emerald-600 text-white ring-2 sm:ring-4 ring-emerald-600/30" : "bg-white text-slate-700 border sm:border-2 border-emerald-300/80 hover:border-emerald-500"
      ]}>
        {dayNum}
      </div>

      <div class="w-full space-y-1 sm:space-y-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            class="w-full bg-emerald-100/60 hover:bg-emerald-200/60 text-emerald-900 rounded-md sm:rounded-xl px-1 sm:px-3 py-1 sm:py-2 text-[9px] sm:text-xs font-bold text-center cursor-pointer transition shadow-xs truncate"
            title={job.job_profile?.name ?? `Job #${job.id}`}
          >
            {job.job_profile?.name ?? `Job #${job.id}`}
          </div>
        ))}
      </div>
    </div>
  );
});