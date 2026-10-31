import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { useAuthUser, useUpdateUser } from "~/hooks/user-auth";
import { useMyTeam } from "~/hooks/teams-handling";
import { ProfileCard } from "./components/profile-card";

export { useUpdateUser, useMyTeam };

export default component$(() => {
  const userSignal = useAuthUser();
  const teamSignal = useMyTeam();
  const updateAction = useUpdateUser();

  const user = userSignal.value;
  const currentTeam = teamSignal.value;

  return (
    <div class="w-full max-w-4xl mx-auto pb-8">
      <ProfileCard user={user} team={currentTeam} updateAction={updateAction} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "My Profile | Amend Portal",
  meta: [
    {
      name: "description",
      content: "View and manage your employee profile and credentials",
    },
  ],
};