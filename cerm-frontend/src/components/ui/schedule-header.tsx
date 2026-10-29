import { component$, $ } from "@builder.io/qwik";
import { IconCalendar } from "~/components/ui/icons";
import type { Job } from "~/hooks/job-handling";
import type { Team } from "~/hooks/teams-handling";
import { ScheduleJobCard } from "./schedule-job-card";

interface ScheduleHeaderProps {
  currentWeekStart: Date;
  onWeekChange$: (newStart: Date) => void;
  selectedDateKey: { value: string };
  jobsByDate?: Map<string, Job[]>;
  onSelectJob$?: (job: Job) => void;
  color?: string; 
  team?: Team | null;
  teams?: Team[];
}

export const ScheduleHeader = component$<ScheduleHeaderProps>(({
  currentWeekStart,
  onWeekChange$,
  selectedDateKey,
  jobsByDate,
  onSelectJob$,
  color = "#059669",
  team = null,
  teams = [],
}) => {
  const getLocalDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    return {
      dayNumber: day.getDate(),
      dayName: ["S", "M", "T", "W", "T", "F", "S"][day.getDay()],
      fullDayName: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][day.getDay()],
      dateKey: getLocalDateKey(day),
    };
  });

  const todayKey = getLocalDateKey(new Date());

  const handleNavigate = $((direction: "prev" | "next") => {
    const target = new Date(currentWeekStart);
    target.setDate(target.getDate() + (direction === "next" ? 7 : -7));
    onWeekChange$(target);
  });

  // Compute Week Date Range string
  const sunday = new Date(currentWeekStart);
  sunday.setDate(sunday.getDate() + 6);

  const startMonth = currentWeekStart.toLocaleString("en-US", { month: "short" });
  const startMonthLong = currentWeekStart.toLocaleString("en-US", { month: "long" });
  const startDay = currentWeekStart.getDate();
  const endMonth = sunday.toLocaleString("en-US", { month: "short" });
  const endMonthLong = sunday.toLocaleString("en-US", { month: "long" });
  const endDay = sunday.getDate();

  const dateRangeStrMobile = startMonth === endMonth
    ? `${startMonth} ${startDay} - ${endDay}`
    : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

  const dateRangeStrDesktop = startMonthLong === endMonthLong
    ? `${startMonthLong} ${startDay} - ${endDay}`
    : `${startMonthLong} ${startDay} - ${endMonthLong} ${endDay}`;

  return (
    <div class="w-full flex flex-col gap-4 px-2 sm:px-0">
      {/* Header & Navigation controls */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-col items-start gap-1.5 w-full md:w-auto">
          {/* Single Team Badge above header text in fixed green styling */}
          {team && (
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span class="w-2 h-2 rounded-full shrink-0 bg-emerald-600" />
              {team.name}
            </span>
          )}

          {/* Multiple Teams Guide/Legend if `teams` is populated */}
          {!team && teams.length > 0 && (
            <div class="flex flex-wrap items-center gap-3 px-1 mb-1">
              <span class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Teams:</span>
              {teams.map((t) => (
                <div key={t.id} class="flex items-center gap-1.5">
                  <div
                    class="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: t.team_color || "#E5E7EB" }}
                  />
                  <span class="text-[11px] sm:text-xs font-semibold text-gray-700">{t.name}</span>
                </div>
              ))}
            </div>
          )}

          <div class="w-full flex items-center justify-between md:justify-start gap-2">
            <h1 class="text-sm sm:text-xl md:text-2xl font-black tracking-tight text-gray-900 flex items-center gap-1.5 sm:gap-2 truncate">
              <IconCalendar class="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
              <span class="block sm:hidden truncate">Week of {dateRangeStrMobile}</span>
              <span class="hidden sm:block truncate">Week of {dateRangeStrDesktop}</span>
            </h1>

            {/* Mobile navigation buttons displayed right next to the title on the same line */}
            <div class="flex items-center gap-1.5 shrink-0 md:hidden">
              <button
                onClick$={() => handleNavigate("prev")}
                class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-[11px] px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center whitespace-nowrap cursor-pointer border-0"
                aria-label="Previous Week"
              >
                &larr; Prev
              </button>
              <button
                onClick$={() => handleNavigate("next")}
                class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-[11px] px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center whitespace-nowrap cursor-pointer border-0"
                aria-label="Next Week"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet navigation buttons */}
        <div class="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick$={() => handleNavigate("prev")}
            class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center whitespace-nowrap cursor-pointer border-0"
            aria-label="Previous Week"
          >
            &larr; Prev
          </button>
          <button
            onClick$={() => handleNavigate("next")}
            class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center whitespace-nowrap cursor-pointer border-0"
            aria-label="Next Week"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div class="grid grid-cols-7 gap-1 sm:gap-3 pt-2">
        {weekDays.map((d) => {
          const isSelected = selectedDateKey.value === d.dateKey;
          const isToday = todayKey === d.dateKey;
          const dayJobs = jobsByDate?.get(d.dateKey) ?? [];

          return (
            <div
              key={d.dateKey}
              onClick$={() => (selectedDateKey.value = d.dateKey)}
              class="flex flex-col items-center justify-start cursor-pointer group gap-1.5"
            >
              <span class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">
                <span class="block sm:hidden">{d.dayName}</span>
                <span class="hidden sm:block">{d.fullDayName}</span>
              </span>

              <div
                class={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-base transition-all ${
                  isToday
                    ? "bg-emerald-600 text-white font-bold"
                    : "border-2 border-emerald-600/30 text-gray-700 font-semibold hover:border-emerald-600 hover:bg-emerald-50/50"
                } ${
                  isSelected ? "ring-2 ring-emerald-500 ring-offset-2 scale-105" : ""
                }`}
              >
                {d.dayNumber}
              </div>

              {dayJobs.length > 0 && (
                <div class="w-full flex flex-col gap-1 mt-1 overflow-y-auto max-h-[140px] sm:max-h-[160px]">
                  {dayJobs.map((job) => {
                    let jobColor = color;
                    const jobTeamId = job.team_id || (job as any).team?.id;

                    // Only apply team colors to job cards if the teams array has values
                    if (teams.length > 0 && jobTeamId) {
                      const matchedTeam = teams.find((t) => t.id === jobTeamId);
                      if (matchedTeam?.team_color) {
                        jobColor = matchedTeam.team_color;
                      }
                    }

                    return (
                      <ScheduleJobCard
                        key={job.id}
                        job={job}
                        color={jobColor}
                        onClick$={() => onSelectJob$?.(job)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});