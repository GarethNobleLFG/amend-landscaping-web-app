import { component$, type PropFunction } from "@builder.io/qwik";

interface DescriptionModalProps {
  title?: string;
  description: string;
  onClose$: PropFunction<() => void>;
}

export const DescriptionModal = component$<DescriptionModalProps>(
  ({ title = "Full Description", description, onClose$ }) => {
    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div class="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">{title}</h3>
            <button
              onClick$={onClose$}
              class="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>

          <div class="max-h-60 overflow-y-auto pr-1 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
            {description || "No description available."}
          </div>

          <div class="flex justify-end pt-2">
            <button
              onClick$={onClose$}
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);