import { component$, type PropFunction } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";
import { IconEdit, IconTrash } from "./icons";

interface TeamCardProps {
  team: Team;
  onEdit$: PropFunction<(team: Team) => void>;
  onDelete$: PropFunction<(id: number) => void>;
}

export const TeamCard = component$(({ team, onEdit$, onDelete$ }: TeamCardProps) => {
  return (
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-all">
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 font-extrabold flex items-center justify-center text-sm">
          {team.name ? team.name.charAt(0).toUpperCase() : "T"}
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900">{team.name}</h4>
          <p class="text-xs text-gray-400 mt-0.5">
            Created: {team.created_at ? new Date(team.created_at).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          onClick$={() => onEdit$(team)}
          class="p-2 rounded-xl text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all"
          title="Edit Team"
        >
          <IconEdit />
        </button>
        <button
          onClick$={() => onDelete$(team.id)}
          class="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          title="Delete Team"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
});