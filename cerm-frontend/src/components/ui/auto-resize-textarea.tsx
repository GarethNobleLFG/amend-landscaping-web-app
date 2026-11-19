import { component$, type PropFunction, type Signal } from "@builder.io/qwik";

export interface AutoResizeTextareaProps {
  id?: string;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  rows?: number;
  minHeight?: number;
  disabled?: boolean;
  value?: string;
  signal?: Signal<string>;
  class?: string;
  onValueChange$?: PropFunction<(value: string) => void>;
}

export const AutoResizeTextarea = component$<AutoResizeTextareaProps>(({
  id,
  label,
  labelClass = "block text-xs font-semibold text-gray-500 mb-1",
  placeholder = "",
  rows = 3,
  minHeight = 88,
  disabled = false,
  value,
  signal,
  class: extraClass = "",
  onValueChange$,
}) => {
  const currentValue = signal ? signal.value : (value ?? "");

  return (
    <div>
      {label && (
        <label for={id} class={labelClass}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        value={currentValue}
        placeholder={placeholder}
        onInput$={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (signal) {
            signal.value = target.value;
          }
          onValueChange$?.(target.value);

          target.style.height = "auto";
          target.style.height = `${Math.max(target.scrollHeight, minHeight)}px`;
        }}
        style={{ minHeight: `${minHeight}px` }}
        class={[
          "auto-expand w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-hidden",
          extraClass,
        ]}
      />
    </div>
  );
});