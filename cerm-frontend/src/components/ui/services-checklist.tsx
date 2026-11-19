import { component$, $, type Signal, type PropFunction } from "@builder.io/qwik";

export interface ServicesChecklistProps {
  services: Signal<Record<string, boolean>>;
  availableServiceKeys?: string[];
  label?: string;
  disabled?: boolean;
  onChange$?: PropFunction<(updatedServices: Record<string, boolean>) => void>;
  titleClass?: string;
}

export const ServicesChecklist = component$<ServicesChecklistProps>(({
  services,
  availableServiceKeys,
  label = "Requested Services",
  disabled = false,
  onChange$,
  titleClass = "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2",
}) => {
  const keys = availableServiceKeys && availableServiceKeys.length > 0
    ? availableServiceKeys
    : Object.keys(services.value);

  const handleToggle = $((key: string, checked: boolean) => {
    const updated = {
      ...services.value,
      [key]: checked,
    };
    services.value = updated;
    onChange$?.(updated);
  });

  return (
    <div>
      <label class={titleClass}>
        {label}
      </label>
      <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 h-48 overflow-hidden">
        {keys.length > 0 ? (
          <div class="h-full grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-2.5">
            {keys.map((serviceName) => {
              const isChecked = Boolean(services.value[serviceName]);
              return (
                <label
                  key={serviceName}
                  class={[
                    "h-full flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-green-500 transition-all text-xs font-semibold text-gray-800 select-none",
                    disabled ? "opacity-60 pointer-events-none" : ""
                  ]}
                >
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={isChecked}
                    onChange$={(e) => {
                      const checked = (e.target as HTMLInputElement).checked;
                      handleToggle(serviceName, checked);
                    }}
                    class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 shrink-0"
                  />
                  <span class="truncate">{serviceName}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div class="h-full flex items-center justify-center">
            <span class="text-xs text-gray-400 italic">No services available</span>
          </div>
        )}
      </div>
    </div>
  );
});