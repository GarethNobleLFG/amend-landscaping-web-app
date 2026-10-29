import { component$, useSignal, useComputed$, useTask$, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByMonth, useDeleteJob, useUpdateJob, type Job } from "~/hooks/job-handling"; // Ensure useUpdateJob is imported
import { useTeams, type Team } from "~/hooks/teams-handling";
import { CalendarHeader } from "./components/calendar-header";
import { CalendarDayCell } from "./components/calendar-day-cell";
import { EditModal } from "./components/edit-modal"; // Import your EditModal
import { buildMonthGrid } from "~/utils/calendar-utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export { useJobsByMonth, useTeams, useDeleteJob, useUpdateJob }; // Export actions

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const jobsLoader = useJobsByMonth();
  const teamsLoader = useTeams();
  const deleteAction = useDeleteJob();
  const updateAction = useUpdateJob(); // Instantiate update action

  // State to track which job is currently being edited
  const editingJob = useSignal<Job | null>(null);

  const activeYear = useSignal(Number(loc.url.searchParams.get("year")) || new Date().getFullYear());
  const activeMonth = useSignal(Number(loc.url.searchParams.get("month")) || new Date().getMonth() + 1);

  useTask$(({ track }) => {
    const search = track(() => loc.url.search);
    const params = new URLSearchParams(search);
    
    activeYear.value = Number(params.get("year")) || new Date().getFullYear();
    activeMonth.value = Number(params.get("month")) || new Date().getMonth() + 1;
  });

  const activeDate = useComputed$(() => new Date(activeYear.value, activeMonth.value - 1, 1));

  const monthGrid = useComputed$(() => {
    return buildMonthGrid(activeYear.value, activeMonth.value - 1);
  });

  const teamsMap = useComputed$(() => {
    const map = new Map<number, Team>();
    const rawTeams = teamsLoader.value;
    if (Array.isArray(rawTeams)) {
      for (const team of rawTeams) {
        map.set(team.id, team);
      }
    }
    return map;
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

  const teamsList = Array.isArray(teamsLoader.value) ? teamsLoader.value : [];

  return (
    <div class="max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-6">
      <CalendarHeader
        currentDate={activeDate.value}
        teams={teamsList}
        onNavigate$={handleNavigate$}
      />

      <div class="grid grid-cols-7 mb-3 px-1">
        {WEEKDAYS.map((day) => (
          <div key={day} class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div class="grid grid-cols-7 gap-2.5">
        {monthGrid.value.days.map((dayMeta, index) => {
          const gridColumnStart = index === 0 ? monthGrid.value.startingDayOfWeek + 1 : undefined;
          const dayJobs = jobsByDate.value.get(dayMeta.dateKey) ?? [];

          return (
            <CalendarDayCell
              key={dayMeta.dateKey}
              dayNumber={dayMeta.dayNumber}
              dayOfWeek={dayMeta.dayOfWeek}
              isToday={dayMeta.isToday}
              jobs={dayJobs}
              teamsMap={teamsMap.value}
              deleteAction={deleteAction}
              onEditJob$={(job) => {
                editingJob.value = job; // Sets the job state to trigger EditModal
              }}
              gridColumnStart={gridColumnStart}
            />
          );
        })}
      </div>

      {/* Render EditModal when editingJob.value is set */}
      {editingJob.value && (
        <EditModal
          job={editingJob.value}
          updateAction={updateAction}
          onClose$={() => (editingJob.value = null)}
        />
      )}
    </div>
  );
});