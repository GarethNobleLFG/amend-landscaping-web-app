import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";
import { IconX } from "./icons";

interface EditModalProps {
  team: Team;
  updateAction: any;
  onClose$: PropFunction<() => void>;
}

export const EditModal = component$(({ team, updateAction, onClose$ }: EditModalProps) => {
  const teamNameInput = useSignal(team.name);
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);
  const errorMessage = useSignal("");

  const handleSubmit = $(async () => {
    if (isSubmitting.value || isSuccess.value) return;
    if (!teamNameInput.value.trim()) {
      errorMessage.value = "Team name is required";
      return;
    }

    isSubmitting.value = true;
    errorMessage.value = "";

    try {
      const res = await updateAction.submit({ id: team.id, name: teamNameInput.value });
      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        isSubmitting.value = false;
        isSuccess.value = true;
        setTimeout(() => {
          onClose$();
        }, 1200);
      } else {
        isSubmitting.value = false;
        errorMessage.value = res?.value?.message || "Failed to update team";
      }
    } catch {
      isSubmitting.value = false;
      errorMessage.value = "Network error. Please try again.";
    }
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick$={onClose$}
          disabled={isSubmitting.value || isSuccess.value}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50"
        >
          <IconX class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-extrabold text-gray-900 mb-1">Edit Team</h3>
        <p class="text-xs text-gray-500 mb-6">Update the name for team #{team.id}.</p>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={teamNameInput.value}
              onInput$={(e) => (teamNameInput.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick$={onClose$}
              disabled={isSubmitting.value || isSuccess.value}
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick$={handleSubmit}
              disabled={isSubmitting.value || isSuccess.value}
              class="min-w-[125px] h-[38px] px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-90 disabled:hover:bg-green-600"
            >
              {isSuccess.value ? (
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path
                    class="css-check-path"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : isSubmitting.value ? (
                <div class="css-spinner" />
              ) : (
                <span>Update Team</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});