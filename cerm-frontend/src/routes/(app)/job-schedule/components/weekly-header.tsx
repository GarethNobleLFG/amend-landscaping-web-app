import { component$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";

interface WeeklyHeaderProps {
  teamName?: string;
  dateRangeLabel: string;
  onNavigate$: QRL<(direction: "prev" | "next" | "today") => void>;
}

export const WeeklyHeader = component$(({ teamName, dateRangeLabel, onNavigate$ }: WeeklyHeaderProps) => {
  return (
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {teamName ?? "No Team Assigned"}
        </div>

        <div class="flex items-center gap-3">
          <svg class="w-7 h-7 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {dateRangeLabel}
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          onClick$={() => onNavigate$("prev")}
          class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
        >
          <span>←</span> Prev
        </button>

        <button
          onClick$={() => onNavigate$("today")}
          class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
        >
          Today
        </button>

        <button
          onClick$={() => onNavigate$("next")}
          class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
});