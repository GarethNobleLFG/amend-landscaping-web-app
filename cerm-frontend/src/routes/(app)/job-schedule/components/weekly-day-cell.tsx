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

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((j) => Boolean(j.completed)).length;
  const remainingJobs = totalJobs - completedJobs;

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

      {/* Stacked integer badges */}
      <div class="w-full flex flex-col items-center justify-center min-h-[46px] sm:min-h-[52px]">
        {totalJobs > 0 ? (
          <div class="flex flex-col items-center justify-center gap-1">
            {/* Open / Remaining jobs to do */}
            {remainingJobs > 0 && (
              <span
                class={[
                  "inline-flex items-center justify-center font-extrabold rounded-md sm:rounded-lg min-w-[22px] sm:min-w-[26px] h-5 sm:h-6 px-1.5 text-[11px] sm:text-xs shadow-xs transition-colors",
                  isSelected
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                ]}
                title={`${remainingJobs} job${remainingJobs === 1 ? "" : "s"} remaining`}
              >
                {remainingJobs}
              </span>
            )}

            {/* Completed jobs integer with thin diagonal grey cross-out */}
            {completedJobs > 0 && (
              <span
                class="relative inline-flex items-center justify-center font-bold text-[11px] sm:text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-md sm:rounded-lg min-w-[22px] sm:min-w-[26px] h-5 sm:h-6 px-1.5 shadow-2xs overflow-hidden"
                title={`${completedJobs} completed job${completedJobs === 1 ? "" : "s"}`}
              >
                <span>{completedJobs}</span>
                <svg
                  class="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="100"
                    x2="100"
                    y2="0"
                    stroke="#94a3b8"
                    stroke-width="0.5"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>
              </span>
            )}
          </div>
        ) : (
          <span class="text-xs font-bold text-slate-300">-</span>
        )}
      </div>
    </div>
  );
});