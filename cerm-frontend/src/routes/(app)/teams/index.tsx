import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam, type Team } from "~/hooks/teams-handling";
import { IconPlus } from "../../../components/ui/icons";
import { TeamCard } from "./components/team-card";
import { CreateModal } from "./components/create-modal";
import { EditModal } from "./components/edit-modal";
import { DeleteModal } from "./components/delete-modal";

// Re-export loaders and actions for Qwik City
export { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam };

export default component$(() => {
  const teamsSignal = useTeams();
  const createAction = useCreateTeam();
  const updateAction = useUpdateTeam();
  const deleteAction = useDeleteTeam();

  const teams = teamsSignal.value || [];

  // Modal control signals
  const isCreateOpen = useSignal(false);
  const editingTeam = useSignal<Team | null>(null);
  const deleteTargetId = useSignal<number | null>(null);

  const handleOpenCreate = $(() => {
    isCreateOpen.value = true;
  });

  const handleOpenEdit = $((team: Team) => {
    editingTeam.value = team;
  });

  const handleCloseModals = $(() => {
    isCreateOpen.value = false;
    editingTeam.value = null;
    deleteTargetId.value = null;
  });

  return (
    <div class="space-y-6">
      {/* CSS Animation Keyframes for Spinner and SVG Checkmark Drawing */}
      <style dangerouslySetInnerHTML={`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes draw-check {
            0% { stroke-dashoffset: 24; }
            100% { stroke-dashoffset: 0; }
        }
        .css-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }
        .css-check-path {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
            animation: draw-check 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
      `} />

      {/* Top Header Row with Create Button Positioned Far Right */}
      <div class="relative flex items-center justify-end w-full">
        <button
          onClick$={handleOpenCreate}
          class="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center gap-2 whitespace-nowrap"
        >
          <IconPlus class="w-4 h-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Invisible Scrollable Container for Teams list */}
      <div class="max-h-[550px] overflow-y-auto pr-1 pb-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
        {teams.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No teams found
          </div>
        ) : (
          teams.map((team: Team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit$={handleOpenEdit}
              onDelete$={(id) => (deleteTargetId.value = id)}
            />
          ))
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateOpen.value && (
        <CreateModal createAction={createAction} onClose$={handleCloseModals} />
      )}

      {/* Edit Team Modal */}
      {editingTeam.value && (
        <EditModal team={editingTeam.value} updateAction={updateAction} onClose$={handleCloseModals} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId.value !== null && (
        <DeleteModal teamId={deleteTargetId.value} deleteAction={deleteAction} onClose$={handleCloseModals} />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Teams Management | Amend Portal",
  meta: [
    {
      name: "description",
      content: "Manage teams and groups",
    },
  ],
};