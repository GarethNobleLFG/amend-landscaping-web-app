import { component$, useSignal, $ } from "@builder.io/qwik";
import type { AuthUser } from "~/hooks/user-auth";
import type { Team } from "~/hooks/teams-handling";
import { UserSelfEditForm } from "./user-self-edit-form";

interface UserCardProps {
  user: AuthUser;
  currentUserId?: string;
  teams: Team[];
  roles: readonly string[];
  updateAction: any;
}

export const UserCard = component$(({
  user,
  currentUserId,
  teams,
  roles,
  updateAction,
}: UserCardProps) => {
  const selectedTeamId = useSignal<string>(user.team_id ? String(user.team_id) : "");
  const selectedRole = useSignal<string>(user.role || "EMPLOYEE");
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);
  const isEditingSelf = useSignal(false);

  const isSelf = currentUserId === user.id;

  const handleUpdate = $(async (newTeamId: string, newRole: string) => {
    isSubmitting.value = true;
    try {
      const teamIdPayload = newTeamId === "" ? null : Number(newTeamId);
      const res = await updateAction.submit({
        id: user.id,
        name: user.name,
        email: user.email,
        role: newRole,
        team_id: teamIdPayload,
      });

      const isOk = res?.status === 200 || res?.value?.success;
      if (isOk) {
        isSubmitting.value = false;
        isSuccess.value = true;
        isEditingSelf.value = false;
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

  const handleTeamChange = $(async (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    selectedTeamId.value = val;
    await handleUpdate(val, selectedRole.value);
  });

  const handleRoleChange = $(async (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    selectedRole.value = val;
    await handleUpdate(selectedTeamId.value, val);
  });

  return (
    <div class="bg-white rounded-2xl p-4 flex flex-col gap-3 transition-all border-none">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-gray-900">{user.name}</h4>
              {isSelf && (
                <span class="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full">
                  You
                </span>
              )}
            </div>
            <p class="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Controls: Full-width stacked controls on mobile, inline flex row on desktop */}
        <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {isSuccess.value && (
            <span class="text-xs font-semibold text-green-600 animate-fade-in text-center sm:text-left">Saved!</span>
          )}
          {isSubmitting.value && (
            <span class="text-xs font-semibold text-gray-400 text-center sm:text-left">Saving...</span>
          )}

          {isSelf && (
            <button
              onClick$={() => {
                isEditingSelf.value = !isEditingSelf.value;
              }}
              class="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
            >
              {isEditingSelf.value ? "Cancel" : "Edit My Details"}
            </button>
          )}

          {/* Role Selector Dropdown */}
          <div class="w-full sm:w-36">
            <select
              value={selectedRole.value}
              onChange$={handleRoleChange}
              disabled={isSubmitting.value}
              class="w-full px-3 py-2 bg-slate-50 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Team Selector Dropdown */}
          <div class="w-full sm:w-44">
            <select
              value={selectedTeamId.value}
              onChange$={handleTeamChange}
              disabled={isSubmitting.value}
              class="w-full px-3 py-2 bg-slate-50 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="">None (No Team)</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Embedded Self-Edit Form Component */}
      {isEditingSelf.value && (
        <UserSelfEditForm
          user={user}
          selectedRole={selectedRole.value}
          selectedTeamId={selectedTeamId.value}
          updateAction={updateAction}
          onSuccess$={$(() => {
            isSubmitting.value = false;
            isSuccess.value = true;
            isEditingSelf.value = false;
            setTimeout(() => {
              isSuccess.value = false;
            }, 1500);
          })}
        />
      )}
    </div>
  );
});