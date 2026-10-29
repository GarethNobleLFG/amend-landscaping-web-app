import { component$, $ } from "@builder.io/qwik";
import { IconCalendar } from "~/components/ui/icons";
import type { Job } from "~/hooks/job-handling";
import { ScheduleJobCard } from "./schedule-job-card";

interface ScheduleHeaderProps {
  currentWeekStart: Date;
  onWeekChange$: (newStart: Date) => void;
  selectedDateKey: { value: string };
  jobCount?: number;
  jobsByDate?: Map<string, Job[]>;
  onSelectJob$?: (job: Job) => void;
  color?: string; 
}

export const ScheduleHeader = component$<ScheduleHeaderProps>(({
  currentWeekStart,
  onWeekChange$,
  selectedDateKey,
  jobCount = 0,
  jobsByDate,
  onSelectJob$,
  color = "#059669",
}) => {
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const currentMonthName = monthNames[currentWeekStart.getMonth()];
  const currentYear = currentWeekStart.getFullYear();

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
      dayName: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][day.getDay()],
      dateKey: getLocalDateKey(day),
    };
  });

  const todayKey = getLocalDateKey(new Date());

  const handlePrevWeek = $(() => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    onWeekChange$(prev);
  });

  const handleNextWeek = $(() => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    onWeekChange$(next);
  });

  return (
    <div class="w-full flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <IconCalendar class="w-6 h-6 text-emerald-600" />
            <span>SCHEDULE - {currentMonthName} {currentYear}</span>
          </h1>
          <p class="text-xs md:text-sm text-gray-600 mt-0.5 font-medium">
            Active Team Schedule ({jobCount} jobs loaded)
          </p>
        </div>

        <div class="flex items-center gap-1">
          <button
            onClick$={handlePrevWeek}
            class="p-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer font-bold"
            title="Previous Week"
          >
            ‹
          </button>
          <button
            onClick$={handleNextWeek}
            class="p-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer font-bold"
            title="Next Week"
          >
            ›
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1 md:gap-3 pt-2">
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
              <span class="text-[10px] md:text-xs font-bold text-gray-400 uppercase">
                {d.dayName}
              </span>
              <div
                class={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base transition-all ${
                  isToday
                    ? "bg-emerald-600 text-white font-bold"
                    : "border-2 border-emerald-600/30 text-gray-700 font-semibold hover:border-emerald-600 hover:bg-emerald-50/50"
                } ${
                  isSelected ? "ring-2 ring-emerald-500 ring-offset-2 scale-105" : ""
                }`}
              >
                {d.dayNumber}
              </div>

              {/* Job Cards render under each date circle when present */}
              {dayJobs.length > 0 && (
                <div class="w-full flex flex-col gap-1 mt-1 overflow-y-auto max-h-[160px]">
                  {dayJobs.map((job) => (
                    <ScheduleJobCard
                      key={job.id}
                      job={job}
                      color={color}
                      onClick$={() => onSelectJob$?.(job)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});