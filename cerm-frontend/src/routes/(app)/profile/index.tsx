import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useAuthUser, useUpdateUser } from "~/hooks/user-auth";
import { useTeams } from "~/hooks/teams-handling";
import { ProfileCard } from "./components/profile-card";

export { useUpdateUser, useTeams };

export default component$(() => {
  const userSignal = useAuthUser();
  const teamsSignal = useTeams();
  const updateAction = useUpdateUser();

  const user = userSignal.value;
  const teams = teamsSignal.value || [];

  return (
    <div class="w-full max-w-4xl mx-auto pb-8">
      <ProfileCard user={user} teams={teams} updateAction={updateAction} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "My Profile - CERM by Amend",
  meta: [
    {
      name: "description",
      content: "View and manage your employee profile and credentials",
    },
  ],
};