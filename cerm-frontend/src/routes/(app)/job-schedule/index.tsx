import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByWeekAndTeam, type Job } from "~/hooks/job-handling"; 
import { useMyTeam } from "~/hooks/teams-handling"; 

export { useMyTeam };
export { useJobsByWeekAndTeam };

// Helper to get current Date strictly in America/New_York (EST/EDT)
function getESTDate(date = new Date()): Date {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  return new Date(year, month, day);
}

function getMonday(d: Date): Date {
  const estDate = getESTDate(d);
  const day = estDate.getDay();
  const diff = estDate.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(estDate.setDate(diff));
}

function parseLocalDate(isoString: string): Date {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYYYYMMDD(isoString: string): string {
  return isoString.split("T")[0];
}

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const myTeamSignal = useMyTeam();
  const jobsSignal = useJobsByWeekAndTeam();

  const currentMondaySignal = useSignal<Date>(() => {
    const startParam = loc.url.searchParams.get("start");
    return getMonday(startParam ? parseLocalDate(startParam) : new Date());
  });

  const targetWeekStartSignal = useSignal<string | null>(null);

  useTask$(({ track }) => {
    const targetStart = track(() => targetWeekStartSignal.value);
    if (!targetStart) return;

    const startDate = parseLocalDate(targetStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const params = new URLSearchParams(loc.url.search);
    params.set("start", targetStart);
    params.set("end", formatDateISO(endDate));

    nav(`?${params.toString()}`);
  });

  const monday = currentMondaySignal.value;
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

  const todayStr = formatDateISO(getESTDate(new Date()));

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
              <svg
                class="w-7 h-7 text-emerald-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {dateRangeLabel}
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              onClick$={() => {
                const prevMon = new Date(currentMondaySignal.value);
                prevMon.setDate(prevMon.getDate() - 7);
                const correctedMonday = getMonday(prevMon); // Ensure it locks back to Monday
                currentMondaySignal.value = correctedMonday;
                targetWeekStartSignal.value = formatDateISO(correctedMonday);
              }}
              class="flex items-center gap-1.5 px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
            >
              <span>←</span> Prev
            </button>

            <button
              onClick$={() => {
                const nextMon = new Date(currentMondaySignal.value);
                nextMon.setDate(nextMon.getDate() + 7);
                const correctedMonday = getMonday(nextMon); // Ensure it locks back to Monday
                currentMondaySignal.value = correctedMonday;
                targetWeekStartSignal.value = formatDateISO(correctedMonday);
              }}
              class="flex items-center gap-1.5 px-4 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-sm font-semibold rounded-2xl transition active:scale-95"
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
            const dayName = dayDate
              .toLocaleString("en-US", { weekday: "short" })
              .toUpperCase();
            const dayNum = dayDate.getDate();

            const dayJobs = (jobsSignal.value ?? []).filter(
              (j: Job) => getYYYYMMDD(j.scheduled_day) === dateISO
            );

            return (
              <div key={dateISO} class="flex flex-col items-center">
                <span class="text-xs sm:text-sm font-bold text-slate-400 mb-3 tracking-wider">
                  {dayName}
                </span>

                <div
                  class={[
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all shadow-xs mb-4",
                    isToday
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-600/30"
                      : "bg-white text-slate-700 border-2 border-emerald-300/80 hover:border-emerald-500",
                  ]}
                >
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