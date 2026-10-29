import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { useJobsByWeekAndTeam } from "~/hooks/job-handling"; 
import { useMyTeam } from "~/hooks/teams-handling"; 
import { ScheduleHeader } from "~/components/ui/schedule-header";

export { useJobsByWeekAndTeam, useMyTeam };

const getLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getMondayOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();

  // Fetches auth/me and the team automatically on the server
  const teamData = useMyTeam();
  const weeklyJobs = useJobsByWeekAndTeam();

  // If start/end are missing from the URL on first load, set them immediately
  const queryStart = loc.url.searchParams.get("start");
  const queryEnd = loc.url.searchParams.get("end");

  if (!queryStart || !queryEnd) {
    const monday = getMondayOfWeek(new Date());
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const url = new URL(loc.url);
    url.searchParams.set("start", getLocalDateKey(monday));
    url.searchParams.set("end", getLocalDateKey(sunday));
    
    nav(url.pathname + url.search, { replaceState: true });
  }

  const initialWeekStart = queryStart ? new Date(queryStart) : getMondayOfWeek(new Date());
  const currentWeekStartSig = useSignal<Date>(getMondayOfWeek(initialWeekStart));
  const selectedDateKey = useSignal<string>(getLocalDateKey(new Date()));

  const handleWeekChange$ = $((newStart: Date) => {
    const monday = getMondayOfWeek(newStart);
    currentWeekStartSig.value = monday;

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startStr = getLocalDateKey(monday);
    const endStr = getLocalDateKey(sunday);

    const url = new URL(loc.url);
    url.searchParams.set("start", startStr);
    url.searchParams.set("end", endStr);
    nav(url.pathname + url.search);
  });

  const jobsByDate = useComputed$(() => {
    const jobs = Array.isArray(weeklyJobs.value) ? weeklyJobs.value : [];
    const map = new Map<string, typeof jobs>();
    for (const job of jobs) {
      if (!job?.scheduled_day) continue;
      const dateKey = job.scheduled_day.split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(job);
    }
    return map;
  });

  return (
    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <ScheduleHeader
        currentWeekStart={currentWeekStartSig.value}
        onWeekChange$={handleWeekChange$}
        selectedDateKey={selectedDateKey}
        jobsByDate={jobsByDate.value}
        team={teamData.value}
      />
    </div>
  );
});