import { component$, $, useComputed$ } from "@builder.io/qwik";
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

  const activeYear = Number(loc.url.searchParams.get("year")) || new Date().getFullYear();
  const activeMonth = Number(loc.url.searchParams.get("month")) || new Date().getMonth() + 1;

  const activeDate = new Date(activeYear, activeMonth - 1, 1);

  const monthGrid = useComputed$(() => {
    return buildMonthGrid(activeYear, activeMonth - 1);
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
    let newYear = activeYear;
    let newMonth = activeMonth;

    if (direction === "today") {
      const now = new Date();
      newYear = now.getFullYear();
      newMonth = now.getMonth() + 1;
    } else if (direction === "prev") {
      if (activeMonth === 1) {
        newMonth = 12;
        newYear -= 1;
      } else {
        newMonth -= 1;
      }
    } else if (direction === "next") {
      if (activeMonth === 12) {
        newMonth = 1;
        newYear += 1;
      } else {
        newMonth += 1;
      }
    }

    await nav(`?month=${newMonth}&year=${newYear}`);
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Floating Header */}
      <CalendarHeader currentDate={activeDate} onNavigate$={handleNavigate$} />

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

      {/* Strict Month-Only Days Grid */}
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