import { component$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";

interface WeeklyDayCellProps {
  dayDate: Date;
  isToday: boolean;
  isSelected: boolean;
  jobs: Job[];
  onSelect$: QRL<() => void>;
}

export const WeeklyDayCell = component$(({ dayDate, isToday, isSelected, jobs, onSelect$ }: WeeklyDayCellProps) => {
  const dayName = dayDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
  const dayNum = dayDate.getDate();

  return (
    <div
      onClick$={onSelect$}
      class="flex flex-col items-center min-w-0 cursor-pointer select-none group"
    >
      <span class="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 mb-2 sm:mb-3 tracking-wider truncate">
        {dayName}
      </span>

      <div class={[
        "w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-xs sm:text-lg md:text-xl transition-all shrink-0 mb-2 sm:mb-3",
        isToday && isSelected
          ? "bg-green-600 text-white border-4 border-white ring-4 ring-green-500 shadow-md scale-105"
          : isToday
          ? "bg-green-600 text-white border-2 border-emerald-600 ring-4 ring-green-500/20"
          : isSelected
          ? "bg-slate-100 text-slate-900 border-2 border-emerald-500 ring-4 ring-emerald-500/30"
          : "bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300"
      ]}>
        {dayNum}
      </div>

      <div class="w-full space-y-1 sm:space-y-1.5">
        {jobs.map((job) => (
          <div
            key={job.id}
            class="w-full bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-900 rounded-md sm:rounded-xl px-1 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-xs font-bold text-center transition truncate shadow-xs"
            title={job.job_profile?.name ?? `Job #${job.id}`}
          >
            {job.job_profile?.name ?? `Job #${job.id}`}
          </div>
        ))}
      </div>
    </div>
  );
});