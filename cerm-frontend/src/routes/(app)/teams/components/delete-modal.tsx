import { component$, type PropFunction } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

interface DeleteModalProps {
  teamId: number;
  deleteAction: any;
  onClose$: PropFunction<() => void>;
}

export const DeleteModal = component$(({ teamId, deleteAction, onClose$ }: DeleteModalProps) => {
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-center">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Team?</h3>
        <p class="text-xs text-gray-500 mb-6">This action cannot be undone. Members assigned to this team will have their team unassigned.</p>

        <Form action={deleteAction} onSubmit$={async () => {
          onClose$();
        }}>
          <input type="hidden" name="id" value={teamId} />
          <div class="flex justify-center gap-2">
            <button
              type="button"
              onClick$={onClose$}
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              Delete
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});