import { component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByWeekAndTeam, type Job } from "~/hooks/job-handling"; 
import { useMyTeam } from "~/hooks/teams-handling"; 
import { getESTDate, getMonday, parseLocalDate, formatDateISO } from "~/utils/date-utils";

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

  return (
    <div class="min-h-screen bg-[#f3f6f9] p-6 text-slate-800 font-sans">
      <div class="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Controls */}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {myTeamSignal.value?.name ?? "No Team Assigned"}
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
              onClick$={() => {
                const targetMonday = new Date(monday);
                targetMonday.setDate(targetMonday.getDate() - 7);
                const correctedMonday = getMonday(targetMonday);
                nav(`?start=${formatDateISO(correctedMonday)}&end=${formatDateISO(new Date(correctedMonday.setDate(correctedMonday.getDate() + 6)))}`);
              }}
              class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
            >
              <span>←</span> Prev
            </button>

            <button
              onClick$={() => {
                const todayMonday = getMonday(getESTDate());
                const end = new Date(todayMonday);
                end.setDate(todayMonday.getDate() + 6);
                nav(`?start=${formatDateISO(todayMonday)}&end=${formatDateISO(end)}`);
              }}
              class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
            >
              Today
            </button>

            <button
              onClick$={() => {
                const targetMonday = new Date(monday);
                targetMonday.setDate(targetMonday.getDate() + 7);
                const correctedMonday = getMonday(targetMonday);
                nav(`?start=${formatDateISO(correctedMonday)}&end=${formatDateISO(new Date(correctedMonday.setDate(correctedMonday.getDate() + 6)))}`);
              }}
              class="px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
            >
              Next <span>→</span>
            </button>
          </div>
        </div>

        {/* 7-Day Grid Layout */}
        <div class="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {daysOfWeek.map((dayDate) => {
            const dateISO = formatDateISO(dayDate);
            const isToday = dateISO === todayStr;
            const dayName = dayDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
            const dayNum = dayDate.getDate();

            const rawValue = jobsLoader.value;
            const jobs = Array.isArray(rawValue) ? rawValue : [];
            const dayJobs = jobs.filter((j: Job) => j.scheduled_day.split("T")[0] === dateISO);

            return (
              <div key={dateISO} class="flex flex-col items-center">
                <span class="text-xs sm:text-sm font-bold text-slate-400 mb-3 tracking-wider">
                  {dayName}
                </span>

                <div class={[
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all shadow-xs mb-4",
                  isToday ? "bg-emerald-600 text-white ring-4 ring-emerald-600/30" : "bg-white text-slate-700 border-2 border-emerald-300/80 hover:border-emerald-500"
                ]}>
                  {dayNum}
                </div>

                <div class="w-full space-y-2">
                  {dayJobs.map((job: Job) => (
                    <div
                      key={job.id}
                      class="w-full bg-emerald-100/60 hover:bg-emerald-200/60 text-emerald-900 rounded-xl px-3 py-2 text-xs font-bold text-center cursor-pointer transition shadow-xs truncate"
                      title={job.job_profile?.name ?? `Job #${job.id}`}
                    >
                      {job.job_profile?.name ?? `Job #${job.id}`}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
});