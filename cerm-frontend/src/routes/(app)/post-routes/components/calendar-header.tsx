import { component$ } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";

interface CalendarHeaderProps {
  currentDate: Date;
  teams?: Team[];
  onNavigate$: (direction: "prev" | "next" | "today") => void;
}

export const CalendarHeader = component$<CalendarHeaderProps>(({ currentDate, teams = [], onNavigate$ }) => {
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {monthName} <span class="text-gray-400 font-light">{year}</span>
        </h1>
      </div>

      {/* Team Color Legend embedded in the header */}
      {teams.length > 0 && (
        <div class="flex flex-wrap items-center gap-3 px-2">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Teams:</span>
          {teams.map((team) => (
            <div key={team.id} class="flex items-center gap-1.5">
              <div
                class="w-3 h-3 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: team.team_color || "#E5E7EB" }}
              />
              <span class="text-xs font-semibold text-gray-700">{team.name}</span>
            </div>
          ))}
        </div>
      )}

      <div class="flex items-center gap-2">
        <button
          onClick$={() => onNavigate$("prev")}
          class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          aria-label="Previous Month"
        >
          &larr; Prev
        </button>
        <button
          onClick$={() => onNavigate$("next")}
          class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          aria-label="Next Month"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
});