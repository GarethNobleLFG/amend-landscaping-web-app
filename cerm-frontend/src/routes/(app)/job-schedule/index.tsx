import { component$, useSignal, useComputed$, $ } from "@builder.io/qwik";
import { useJobsByWeekAndTeam } from "~/hooks/job-handling"; 
import { ScheduleHeader } from "~/components/ui/schedule-header";

export { useJobsByWeekAndTeam };

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
  const weeklyJobs = useJobsByWeekAndTeam();

  const currentWeekStartSig = useSignal<Date>(getMondayOfWeek(new Date()));
  const selectedDateKey = useSignal<string>(getLocalDateKey(new Date()));

  const handleWeekChange$ = $((newStart: Date) => {
    currentWeekStartSig.value = getMondayOfWeek(newStart);
  });

  // Group jobs by their scheduled date key
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
        jobCount={weeklyJobs.value?.length ?? 0}
        jobsByDate={jobsByDate.value}
      />
    </div>
  );
});