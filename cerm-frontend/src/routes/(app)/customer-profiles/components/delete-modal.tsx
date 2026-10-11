import { component$, type PropFunction } from "@builder.io/qwik";
import type { CustomerProfile } from "../../../../hooks/customer-handling";

interface DeleteModalProps {
  profile: CustomerProfile;
  onClose$: PropFunction<() => void>;
  onConfirm$: PropFunction<() => void>;
}

export const DeleteModal = component$<DeleteModalProps>(({ profile, onClose$, onConfirm$ }) => {
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Profile</h3>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong class="text-gray-900">{profile.name}</strong>? This action cannot be undone.
        </p>

        <div class="flex justify-end gap-2">
          <button
            onClick$={onClose$}
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick$={onConfirm$}
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});