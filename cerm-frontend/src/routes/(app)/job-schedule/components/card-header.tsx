import { component$, type Signal, type QRL } from "@builder.io/qwik";

export interface CardHeaderProps {
  title: string;
  isCompleted: boolean;
  isJobRunning: boolean;
  durationStr: string | null;
  fullAddress: string;
  isExpanded: Signal<boolean>;
  copied: Signal<boolean>;
  isTeamLead: boolean;
  hasStartTime: boolean;
  isSubmitting: Signal<boolean>;
  onCopyAddress$: QRL<(e: Event) => void>;
  onStartJob$: QRL<(e: Event) => void>;
  onEndJob$: QRL<(e: Event) => void>;
}

export const CardHeader = component$<CardHeaderProps>(({
  title,
  isCompleted,
  isJobRunning,
  durationStr,
  fullAddress,
  isExpanded,
  copied,
  isTeamLead,
  hasStartTime,
  isSubmitting,
  onCopyAddress$,
  onStartJob$,
  onEndJob$,
}) => {
  return (
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none gap-2 sm:gap-4"
      onClick$={() => (isExpanded.value = !isExpanded.value)}
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 w-full">
        {/* Title & Status Badges */}
        <div class="flex items-center gap-2 min-w-0">
          <span
            class={`font-bold sm:font-semibold text-gray-900 text-sm sm:text-base truncate ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {title}
          </span>

          {/* Flashing Green In-Progress Badge */}
          {isJobRunning && (
            <span
              title="Job in progress"
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 ring-2 ring-green-500/20 animate-pulse flex-shrink-0"
            >
              <span class="text-sm">🕒</span>
              <span>In Progress</span>
            </span>
          )}

          {isCompleted && (
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100/70 text-emerald-900 tracking-wider flex-shrink-0">
              Completed
            </span>
          )}

          {durationStr && (
            <span class="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-600 flex-shrink-0">
              ⏱ {durationStr}
            </span>
          )}
        </div>

        {/* Copyable Address Pill */}
        {fullAddress && (
          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-slate-50/60 sm:bg-white shadow-none max-w-full">
              <span class="text-xs sm:text-sm text-gray-600 truncate max-w-[220px] xs:max-w-xs sm:max-w-sm">
                {fullAddress}
              </span>

              <button
                type="button"
                class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded flex items-center justify-center flex-shrink-0"
                onClick$={onCopyAddress$}
                title="Copy address"
              >
                {copied.value ? (
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {copied.value && (
              <span class="text-xs font-semibold text-emerald-600 whitespace-nowrap animate-fade-in">
                Address copied!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Lead Action & Expand Chevron */}
      <div class="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-gray-100">
        {isTeamLead && !isCompleted && (
          <div class="mr-1">
            {!hasStartTime ? (
              <button
                type="button"
                disabled={isSubmitting.value}
                onClick$={onStartJob$}
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 active:scale-95 transition-all shadow-sm ring-2 ring-green-500/20 disabled:opacity-50"
              >
                {isSubmitting.value ? "Starting..." : "Start Job"}
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting.value}
                onClick$={onEndJob$}
                class="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-sm ring-2 ring-emerald-600/20 disabled:opacity-50"
              >
                {isSubmitting.value ? "Completing..." : "End Job, Mark Complete"}
              </button>
            )}
          </div>
        )}

        <span class="text-xs text-gray-400 sm:hidden font-medium">
          {isExpanded.value ? "Collapse details" : "Tap to view details"}
        </span>
        <div
          class={`transform transition-transform duration-200 text-gray-400 p-1 ${
            isExpanded.value ? "rotate-180" : ""
          }`}
        >
          ▼
        </div>
      </div>
    </div>
  );
});