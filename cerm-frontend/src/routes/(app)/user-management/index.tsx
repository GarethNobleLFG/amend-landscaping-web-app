import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useUsers, useUpdateUser, useAuthUser, type AuthUser } from "~/hooks/user-auth";
import { useTeams, type Team } from "~/hooks/teams-handling";
import { UserCard } from "./components/user-card";

export { useUsers, useUpdateUser, useTeams };

export const ROLES = ["ADMIN", "EMPLOYEE", "TEAM LEAD", "INACTIVE"] as const;

export default component$(() => {
  const usersSignal = useUsers();
  const teamsSignal = useTeams();
  const authUserSignal = useAuthUser();
  const updateAction = useUpdateUser();

  const users = usersSignal.value || [];
  const teams = teamsSignal.value || [];
  const currentUser = authUserSignal.value;

  // Group users by team_id
  const teamMap = new Map<number | null, AuthUser[]>();
  
  teams.forEach((t) => teamMap.set(t.id, []));
  teamMap.set(null, []); // For users with no team

  users.forEach((user: AuthUser) => {
    const tid = user.team_id ?? null;
    if (!teamMap.has(tid)) {
      teamMap.set(tid, []);
    }
    teamMap.get(tid)!.push(user);
  });

  return (
    <div class="space-y-6">
      {/* Top Header Row with Total Count */}
      <div class="flex items-center justify-between w-full">
        <span class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
          {users.length} {users.length === 1 ? "User" : "Users"} Total
        </span>
      </div>

      {/* Fluid Scrollable Container for Teams / Users sections (Natural flow on mobile, scrollable on desktop) */}
      <div class="w-full pb-4 space-y-6">
        {users.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No users found
          </div>
        ) : (
          <>
            {/* Render each Team Group */}
            {teams.map((team: Team) => {
              const teamUsers = teamMap.get(team.id) || [];
              if (teamUsers.length === 0) return null;

              return (
                <div key={team.id} class="space-y-3">
                  <div class="flex items-center justify-between px-2">
                    <h3 class="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      {team.name}
                    </h3>
                    <span class="text-[10px] font-bold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {teamUsers.length} {teamUsers.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div class="space-y-3">
                    {teamUsers.map((user: AuthUser) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        currentUserId={currentUser?.id}
                        teams={teams}
                        roles={ROLES}
                        updateAction={updateAction}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Render Users with No Team Assigned */}
            {(() => {
              const unassignedUsers = teamMap.get(null) || [];
              if (unassignedUsers.length === 0) return null;

              return (
                <div class="space-y-3">
                  <div class="flex items-center justify-between px-2">
                    <h3 class="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                      Unassigned (No Team)
                    </h3>
                    <span class="text-[10px] font-bold text-gray-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {unassignedUsers.length} {unassignedUsers.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div class="space-y-3">
                    {unassignedUsers.map((user: AuthUser) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        currentUserId={currentUser?.id}
                        teams={teams}
                        roles={ROLES}
                        updateAction={updateAction}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "User Management | Amend Portal",
  meta: [
    {
      name: "description",
      content: "Manage system users, roles, and team assignments",
    },
  ],
};