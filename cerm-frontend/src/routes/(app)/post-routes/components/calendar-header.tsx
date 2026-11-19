import { component$, type PropFunction } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";

interface CalendarHeaderProps {
  currentDate: Date;
  teams?: Team[];
  selectedTeamId?: number | null;
  onSelectTeam$?: PropFunction<(teamId: number | null) => void>;
  onNavigate$: (direction: "prev" | "next" | "today") => void;
}

export const CalendarHeader = component$<CalendarHeaderProps>(({
  currentDate,
  teams = [],
  selectedTeamId = null,
  onSelectTeam$,
  onNavigate$,
}) => {
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div class="flex flex-col gap-3 mb-6">
      {/* Top Row (Above the Header Line): Filter Dropdown + Team Legend */}
      {teams.length > 0 && (
        <div class="flex flex-wrap items-center gap-4">
          {/* Team Dropdown Filter (Flat, No Shadows) */}
          {onSelectTeam$ && (
            <div class="relative w-36">
              <select
                id="team-filter"
                value={selectedTeamId === null ? "all" : String(selectedTeamId)}
                onChange$={(e) => {
                  const val = (e.target as HTMLSelectElement).value;
                  onSelectTeam$(val === "all" ? null : Number(val));
                }}
                class="w-full appearance-none bg-slate-100 border-0 shadow-none text-gray-800 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl hover:bg-slate-200/70 focus:outline-none focus:ring-0 cursor-pointer truncate"
              >
                <option value="all">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={String(team.id)}>
                    {team.name}
                  </option>
                ))}
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Team Color Legend (No "TEAMS:" label) */}
          <div class="flex flex-wrap items-center gap-3">
            {teams.map((team) => (
              <div key={team.id} class="flex items-center gap-1.5">
                <div
                  class="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: team.team_color || "#E5E7EB" }}
                />
                <span class="text-xs font-semibold text-gray-700">{team.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Header Row: Month / Year Title on Left, Prev/Next Navigation on Right */}
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {monthName} <span class="text-gray-400 font-light">{year}</span>
        </h1>

        <div class="flex items-center gap-2 shrink-0">
          <button
            onClick$={() => onNavigate$("prev")}
            class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-none"
            aria-label="Previous Month"
          >
            &larr; Prev
          </button>
          <button
            onClick$={() => onNavigate$("next")}
            class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-none"
            aria-label="Next Month"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
});