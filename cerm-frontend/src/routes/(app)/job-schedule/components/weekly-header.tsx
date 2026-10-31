import { component$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";

interface WeeklyHeaderProps {
  teamName?: string;
  startDate: Date;
  endDate: Date;
  onNavigate$: QRL<(direction: "prev" | "next" | "today") => void>;
}

export const WeeklyHeader = component$(({ teamName, startDate, endDate, onNavigate$ }: WeeklyHeaderProps) => {
  // Mobile format: "Oct 26 - Nov 1" (or "Oct 26 - 31" if same month)
  const startMonthShort = startDate.toLocaleString("en-US", { month: "short" });
  const startDayNum = startDate.getDate();
  const endMonthShort = endDate.toLocaleString("en-US", { month: "short" });
  const endDayNum = endDate.getDate();

  // Desktop format: "October 26 - November 1"
  const startMonthLong = startDate.toLocaleString("en-US", { month: "long" });
  const endMonthLong = endDate.toLocaleString("en-US", { month: "long" });

  const mobileLabel = startMonthShort === endMonthShort
    ? `${startMonthShort} ${startDayNum} - ${endDayNum}`
    : `${startMonthShort} ${startDayNum} - ${endMonthShort} ${endDayNum}`;

  const desktopLabel = startMonthLong === endMonthLong
    ? `Week of ${startMonthLong} ${startDayNum} - ${endDayNum}`
    : `Week of ${startMonthLong} ${startDayNum} - ${endMonthLong} ${endDayNum}`;

  return (
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1.5 sm:space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {teamName ?? "No Team Assigned"}
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {/* Mobile abbreviated label */}
          <h1 class="text-lg font-extrabold tracking-tight text-slate-900 leading-tight sm:hidden">
            {mobileLabel}
          </h1>
          {/* Desktop full label */}
          <h1 class="hidden sm:block sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {desktopLabel}
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick$={() => onNavigate$("prev")}
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition active:scale-95 text-center"
        >
          <span>←</span> Prev
        </button>

        <button
          onClick$={() => onNavigate$("today")}
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition active:scale-95 text-center"
        >
          Today
        </button>

        <button
          onClick$={() => onNavigate$("next")}
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition active:scale-95 text-center"
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
});