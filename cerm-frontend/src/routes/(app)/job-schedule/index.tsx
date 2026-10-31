import { component$, useComputed$, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByWeekAndTeam, type Job } from "~/hooks/job-handling"; 
import { useMyTeam } from "~/hooks/teams-handling"; 
import { getESTDate, getMonday, parseLocalDate, formatDateISO } from "~/utils/date-utils";
import { WeeklyHeader } from "./components/weekly-header";
import { WeeklyDayCell } from "./components/weekly-day-cell";

export { useMyTeam };
export { useJobsByWeekAndTeam };

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const myTeamSignal = useMyTeam();
  const jobsLoader = useJobsByWeekAndTeam();

  const startParam = loc.url.searchParams.get("start");
  const monday = startParam ? parseLocalDate(startParam) : getMonday(getESTDate());

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });

  const startMonth = daysOfWeek[0].toLocaleString("en-US", { month: "long" });
  const startDayNum = daysOfWeek[0].getDate();
  const endMonth = daysOfWeek[6].toLocaleString("en-US", { month: "long" });
  const endDayNum = daysOfWeek[6].getDate();

  const dateRangeLabel =
    startMonth === endMonth
      ? `Week of ${startMonth} ${startDayNum} - ${endDayNum}`
      : `Week of ${startMonth} ${startDayNum} - ${endMonth} ${endDayNum}`;

  const todayStr = formatDateISO(getESTDate());

  const jobsByDate = useComputed$(() => {
    const rawValue = jobsLoader.value;
    const jobs = Array.isArray(rawValue) ? rawValue : [];
    const map = new Map<string, Job[]>();
    for (const job of jobs) {
      if (!job?.scheduled_day) continue;
      const dateKey = job.scheduled_day.split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(job);
    }
    return map;
  });

  const handleNavigate$ = $(async (direction: "prev" | "next" | "today") => {
    const currentStart = loc.url.searchParams.get("start");
    let targetDate: Date;

    if (direction === "today" || !currentStart) {
      targetDate = getMonday(getESTDate());
    } else {
      targetDate = parseLocalDate(currentStart);
      const dayOffset = direction === "next" ? 7 : -7;
      targetDate.setDate(targetDate.getDate() + dayOffset);
    }

    const startDate = formatDateISO(targetDate);
    
    const endDateObj = new Date(targetDate);
    endDateObj.setDate(targetDate.getDate() + 6);
    const endDate = formatDateISO(endDateObj);

    nav(`?start=${startDate}&end=${endDate}`);
  });

  return (
    <div class="min-h-screen bg-[#f3f6f9] p-6 text-slate-800 font-sans">
      <div class="max-w-7xl mx-auto space-y-8">
        
        {/* Modular Header */}
        <WeeklyHeader
          teamName={myTeamSignal.value?.name}
          dateRangeLabel={dateRangeLabel}
          onNavigate$={handleNavigate$}
        />

        {/* 7-Day Grid Layout */}
        <div class="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {daysOfWeek.map((dayDate) => {
            const dateISO = formatDateISO(dayDate);
            const isToday = dateISO === todayStr;
            const dayJobs = jobsByDate.value.get(dateISO) ?? [];

            return (
              <WeeklyDayCell
                key={dateISO}
                dayDate={dayDate}
                isToday={isToday}
                jobs={dayJobs}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
});