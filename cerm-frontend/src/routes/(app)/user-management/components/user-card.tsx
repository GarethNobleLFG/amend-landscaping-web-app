import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { AuthUser } from "~/hooks/user-auth";
import type { Team } from "~/hooks/teams-handling";

interface UserCardProps {
  user: AuthUser;
  teams: Team[];
  updateAction: any;
}

export const UserCard = component$(({ user, teams, updateAction }: UserCardProps) => {
  const selectedTeamId = useSignal<string>(user.team_id ? String(user.team_id) : "");
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);

  const handleTeamChange = $(async (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    selectedTeamId.value = val;
    isSubmitting.value = true;

    try {
      const teamIdPayload = val === "" ? null : Number(val);
      const res = await updateAction.submit({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: teamIdPayload,
      });

      const isOk = res?.status === 200 || res?.value?.success;
      if (isOk) {
        isSubmitting.value = false;
        isSuccess.value = true;
        setTimeout(() => {
          isSuccess.value = false;
        }, 1500);
      } else {
        isSubmitting.value = false;
      }
    } catch {
      isSubmitting.value = false;
    }
  });

  const isAdmin = user.role === "ADMIN";
  const isLead = user.role === "LEAD";

  return (
    <div class="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-green-100 text-green-700 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-gray-900">{user.name}</h4>
            <span
              class={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center ${
                isAdmin
                  ? "bg-purple-100 text-purple-700"
                  : isLead
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.role}
            </span>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">{user.email}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        {isSuccess.value && (
          <span class="text-xs font-semibold text-green-600 animate-fade-in">Saved!</span>
        )}
        {isSubmitting.value && (
          <span class="text-xs font-semibold text-gray-400">Saving...</span>
        )}
        <div class="w-full sm:w-48">
          <select
            value={selectedTeamId.value}
            onChange$={handleTeamChange}
            disabled={isSubmitting.value}
            class="w-full px-3 py-2 bg-slate-50 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="">None</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
});