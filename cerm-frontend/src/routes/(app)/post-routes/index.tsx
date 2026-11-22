import { component$, useSignal, useComputed$, useTask$, $ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useJobsByMonth, useDeleteJob, useCreateJob, useUpdateJob, type Job } from "~/hooks/job-handling";
import { useTeams, type Team } from "~/hooks/teams-handling";
import { CalendarHeader } from "./components/calendar-header";
import { CalendarDayCell } from "./components/calendar-day-cell";
import { CreateModal } from "./components/create-modal";
import { EditModal } from "./components/edit-modal";
import { buildMonthGrid } from "~/utils/calendar-utils";
import { useAmendServices, type Service } from "~/hooks/amend-api-handling";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export { useJobsByMonth, useTeams, useDeleteJob, useCreateJob, useUpdateJob, useAmendServices };

export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const jobsLoader = useJobsByMonth();
  const teamsLoader = useTeams();
  const deleteAction = useDeleteJob();
  const createAction = useCreateJob();
  const updateAction = useUpdateJob();

  const servicesLoader = useAmendServices();
  const availableServices: Service[] = servicesLoader.value || [];

  const selectedTeamId = useSignal<number | null>(null);

  // Modal states
  const creatingDateStr = useSignal<string | null>(null);
  const editingJob = useSignal<Job | null>(null);

  const activeYear = useSignal(Number(loc.url.searchParams.get("year")) || new Date().getFullYear());
  const activeMonth = useSignal(Number(loc.url.searchParams.get("month")) || new Date().getMonth() + 1);

  useTask$(({ track }) => {
    const search = track(() => loc.url.search);
    const params = new URLSearchParams(search);

    const yearParam = params.get("year");
    const monthParam = params.get("month");

    if (yearParam) {
      activeYear.value = Number(yearParam);
    }
    if (monthParam) {
      activeMonth.value = Number(monthParam);
    }
  });

  const activeDate = useComputed$(() => new Date(activeYear.value, activeMonth.value - 1, 1));
  const monthGrid = useComputed$(() => buildMonthGrid(activeYear.value, activeMonth.value - 1));

  const teamsMap = useComputed$(() => {
    const map = new Map<number, Team>();
    const rawTeams = teamsLoader.value;
    if (Array.isArray(rawTeams)) {
      for (const team of rawTeams) map.set(team.id, team);
    }
    return map;
  });

  const jobsByDate = useComputed$(() => {
    const rawValue = jobsLoader.value;
    const jobs = Array.isArray(rawValue) ? rawValue : [];
    const map = new Map<string, typeof jobs>();
    for (const job of jobs) {
      if (!job?.scheduled_day) continue;
      if (selectedTeamId.value !== null && job.team_id !== selectedTeamId.value) {
        continue;
      }
      const dateKey = job.scheduled_day.split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
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
        selectedTeamId={selectedTeamId.value}
        onSelectTeam$={$((teamId: number | null) => {
          selectedTeamId.value = teamId;
        })}
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
              dateKey={dayMeta.dateKey}
              isToday={dayMeta.isToday}
              jobs={dayJobs}
              teamsMap={teamsMap.value}
              deleteAction={deleteAction}
              updateAction={updateAction}
              onEditJob$={(job) => {
                editingJob.value = job;
              }}
              onCreateJob$={(dateKey) => (creatingDateStr.value = dateKey)}
              gridColumnStart={gridColumnStart}
            />
          );
        })}
      </div>

      {/* CreateModal */}
      {creatingDateStr.value && (
        <CreateModal
          selectedDateStr={creatingDateStr.value}
          teams={teamsList}
          availableServices={availableServices}
          createAction={createAction}
          onClose$={() => (creatingDateStr.value = null)}
        />
      )}

      {/* EditModal */}
      {editingJob.value && (
        <EditModal
          job={editingJob.value}
          availableServices={availableServices}
          updateAction={updateAction}
          onClose$={() => (editingJob.value = null)}
        />
      )}
    </div>
  );
});