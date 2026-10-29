import { component$, $, useSignal, useComputed$, useTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByMonth } from "~/hooks/job-handling";
import { CalendarHeader } from "./components/calendar-header";
import { CalendarDayCell } from "./components/calendar-day-cell";
import { buildMonthGrid } from "~/utils/calendar-utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export { useJobsByMonth };

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const jobsLoader = useJobsByMonth();

  // 1. Create reactive signals for year and month
  const activeYear = useSignal(Number(loc.url.searchParams.get("year")) || new Date().getFullYear());
  const activeMonth = useSignal(Number(loc.url.searchParams.get("month")) || new Date().getMonth() + 1);

  // 2. Use a task to explicitly track URL search changes and update signals
  useTask$(({ track }) => {
    const search = track(() => loc.url.search);
    const params = new URLSearchParams(search);
    
    activeYear.value = Number(params.get("year")) || new Date().getFullYear();
    activeMonth.value = Number(params.get("month")) || new Date().getMonth() + 1;
  });

  // 3. Derived active date for the header
  const activeDate = useComputed$(() => new Date(activeYear.value, activeMonth.value - 1, 1));

  // 4. Month grid automatically recalculates when activeYear.value or activeMonth.value changes
  const monthGrid = useComputed$(() => {
    return buildMonthGrid(activeYear.value, activeMonth.value - 1);
  });

  const jobsByDate = useComputed$(() => {
    const rawValue = jobsLoader.value;
    const jobs = Array.isArray(rawValue) ? rawValue : [];
    const map = new Map<string, typeof jobs>();

    for (const job of jobs) {
      if (!job?.scheduled_day) continue;
      const dateKey = job.scheduled_day.split("T")[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(job);
    }

    return map;
  });

  const handleNavigate$ = $(async (direction: "prev" | "next" | "today") => {
    const currentYear = activeYear.value;
    const currentMonth = activeMonth.value;

    let newYear = currentYear;
    let newMonth = currentMonth;

    if (direction === "today") {
      const now = new Date();
      newYear = now.getFullYear();
      newMonth = now.getMonth() + 1;
    } else if (direction === "prev") {
      if (currentMonth === 1) {
        newMonth = 12;
        newYear -= 1;
      } else {
        newMonth -= 1;
      }
    } else if (direction === "next") {
      if (currentMonth === 12) {
        newMonth = 1;
        newYear += 1;
      } else {
        newMonth += 1;
      }
    }

    const currentPath = loc.url.pathname;
    await nav(`${currentPath}?month=${newMonth}&year=${newYear}`);
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-6">
      {/* Floating Header */}
      <CalendarHeader currentDate={activeDate.value} onNavigate$={handleNavigate$} />

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 mb-3 px-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dynamic Month-Only Days Grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {monthGrid.value.days.map((dayMeta, index) => {
          const gridColumnStart = index === 0 ? monthGrid.value.startingDayOfWeek + 1 : undefined;

          return (
            <CalendarDayCell
              key={dayMeta.dateKey}
              dayNumber={dayMeta.dayNumber}
              dayOfWeek={dayMeta.dayOfWeek}
              isToday={dayMeta.isToday}
              jobs={jobsByDate.value.get(dayMeta.dateKey) ?? []}
              gridColumnStart={gridColumnStart}
            />
          );
        })}
      </div>
    </div>
  );
});