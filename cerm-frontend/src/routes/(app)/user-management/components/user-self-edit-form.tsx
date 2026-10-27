import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { AuthUser } from "~/hooks/user-auth";

interface UserSelfEditFormProps {
  user: AuthUser;
  selectedRole: string;
  selectedTeamId: string;
  updateAction: any;
  onSuccess$: PropFunction<() => void>;
}

export const UserSelfEditForm = component$(({
  user,
  selectedRole,
  selectedTeamId,
  updateAction,
  onSuccess$,
}: UserSelfEditFormProps) => {
  const editName = useSignal(user.name);
  const editEmail = useSignal(user.email);
  const editPassword = useSignal("");
  const confirmPassword = useSignal("");
  const selfError = useSignal("");
  const isSubmitting = useSignal(false);

  const handleSelfSave = $(async (e: Event) => {
    e.preventDefault();
    selfError.value = "";

    if (editPassword.value.trim() !== "" && editPassword.value !== confirmPassword.value) {
      selfError.value = "Passwords do not match.";
      return;
    }

    isSubmitting.value = true;

    try {
      const payload: any = {
        id: user.id,
        name: editName.value,
        email: editEmail.value,
        role: selectedRole,
        team_id: selectedTeamId === "" ? null : Number(selectedTeamId),
      };

      if (editPassword.value.trim() !== "") {
        payload.password = editPassword.value;
      }

      const res = await updateAction.submit(payload);

      if (res?.status === 200 || res?.value?.success) {
        isSubmitting.value = false;
        editPassword.value = "";
        confirmPassword.value = "";
        onSuccess$();
      } else {
        isSubmitting.value = false;
        selfError.value = res?.value?.message || "Failed to update profile";
      }
    } catch {
      isSubmitting.value = false;
      selfError.value = "Network error. Please try again.";
    }
  });

  return (
    <form onSubmit$={handleSelfSave} class="mt-3 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/50 p-3 rounded-xl">
      <div class="text-xs font-bold text-gray-700 uppercase tracking-wide">Edit Your Personal Information</div>
      {selfError.value && (
        <div class="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">{selfError.value}</div>
      )}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Name</label>
          <input
            type="text"
            value={editName.value}
            onInput$={(e) => (editName.value = (e.target as HTMLInputElement).value)}
            required
            class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={editEmail.value}
            onInput$={(e) => (editEmail.value = (e.target as HTMLInputElement).value)}
            required
            class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">New Password</label>
          <input
            type="password"
            value={editPassword.value}
            onInput$={(e) => (editPassword.value = (e.target as HTMLInputElement).value)}
            placeholder="Leave blank to keep"
            class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword.value}
            onInput$={(e) => (confirmPassword.value = (e.target as HTMLInputElement).value)}
            placeholder="Re-enter password"
            class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={isSubmitting.value}
          class="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
        >
          {isSubmitting.value ? "Saving..." : "Save Details"}
        </button>
      </div>
    </form>
  );
});