import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { useUsers, useUpdateUser, type AuthUser } from "~/hooks/user-auth";
import { useTeams, type Team } from "~/hooks/teams-handling";
import { UserCard } from "./components/user-card";

export { useUsers, useUpdateUser, useTeams };

export default component$(() => {
  const usersSignal = useUsers();
  const teamsSignal = useTeams();
  const updateAction = useUpdateUser();

  const users = usersSignal.value || [];
  const teams = teamsSignal.value || [];

  return (
    <div class="space-y-6">
      {/* Top Header Row with Total Count */}
      <div class="flex items-center justify-between w-full">
        <span class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
          {users.length} {users.length === 1 ? "User" : "Users"} Total
        </span>
      </div>

      {/* Invisible Scrollable Container for Users list */}
      <div class="max-h-[550px] overflow-y-auto pr-1 pb-6 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
        {users.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No users found
          </div>
        ) : (
          users.map((user: AuthUser) => (
            <UserCard
              key={user.id}
              user={user}
              teams={teams}
              updateAction={updateAction}
            />
          ))
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "User Management - CERM by Amend",
  meta: [
    {
      name: "description",
      content: "Manage system users and team assignments",
    },
  ],
};