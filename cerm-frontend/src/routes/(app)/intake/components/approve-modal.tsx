import { component$, type Signal, type PropFunction, $, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
}

interface ApproveModalProps {
  formData: Signal<Partial<JobProfile>>;
  customMessage?: Signal<string>;
  availableServices?: ServiceItem[];
  onClose$: PropFunction<() => void>;
  onSubmit$: PropFunction<() => any | Promise<any>>;
}

export const ApproveModal = component$<ApproveModalProps>(({
  formData,
  customMessage,
  availableServices = [],
  onClose$,
  onSubmit$,
}) => {
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);
  const step = useSignal<"edit" | "message">("edit");
  const localCustomMessage = useSignal(customMessage?.value || "");

  const autoResizeTextarea = $((el: HTMLTextAreaElement) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  });

  useVisibleTask$(({ track }) => {
    track(() => formData.value);
    track(() => step.value);
    const textareas = document.querySelectorAll<HTMLTextAreaElement>("textarea.auto-expand");
    textareas.forEach((ta) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    });
  });

  const handleSave$=$(async () => {
    if (isSubmitting.value || isSuccess.value) return;

    isSubmitting.value = true;

    // Synchronize signal value if external customMessage signal was provided
    if (customMessage) {
      customMessage.value = localCustomMessage.value;
    }

    try {
      const res = await onSubmit$();
      const isOk = res?.status === 200 || res?.value?.success || res === true;

      if (isOk) {
        isSubmitting.value = false;
        isSuccess.value = true;

        setTimeout(() => {
          onClose$();
        }, 1500);
      } else {
        isSubmitting.value = false;
      }
    } catch (err) {
      console.error(err);
      isSubmitting.value = false;
    }
  });

  const rawServices = formData.value.services_requested;
  const currentServices: Record<string, boolean> =
    typeof rawServices === "string"
      ? (() => { try { return JSON.parse(rawServices); } catch { return {}; } })()
      : (rawServices as Record<string, boolean>) || {};

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <style dangerouslySetInnerHTML={`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes draw-check {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .css-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        .css-check-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: draw-check 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
      `} />

      <div class="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {step.value === "edit" ? (
          <>
            {/* Header */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Approve Intake Request
                </span>
                <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                  {formData.value.name || "Unnamed Request"}
                </h3>
              </div>
            </div>

            {/* Editable Name & Address details section */}
            <div class="mb-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Customer & Property Details
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Job Profile Name (Free to Name How You See Fit) </label>
                  <input
                    type="text"
                    value={formData.value.name || ""}
                    placeholder="Full Name"
                    onInput$={(e) => (formData.value = { ...formData.value, name: (e.target as HTMLInputElement).value })}
                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-gray-900"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.value.address || ""}
                    placeholder="N/A"
                    onInput$={(e) => (formData.value = { ...formData.value, address: (e.target as HTMLInputElement).value })}
                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div class="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.value.city || ""}
                      placeholder="N/A"
                      onInput$={(e) => (formData.value = { ...formData.value, city: (e.target as HTMLInputElement).value })}
                      class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.value.state || ""}
                      placeholder="N/A"
                      onInput$={(e) => (formData.value = { ...formData.value, state: (e.target as HTMLInputElement).value })}
                      class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Zip</label>
                    <input
                      type="text"
                      value={formData.value.zip || ""}
                      placeholder="N/A"
                      onInput$={(e) => (formData.value = { ...formData.value, zip: (e.target as HTMLInputElement).value })}
                      class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Services Checkbox Section */}
            <div class="mb-6">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Services Requested
              </h4>
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {availableServices.length > 0 ? (
                  <div class="grid grid-cols-1 gap-3">
                    {availableServices.map((service) => {
                      const isChecked = Boolean(currentServices[service.name]);
                      return (
                        <label
                          key={service.id}
                          class="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-green-500 transition-all text-sm font-medium text-gray-900 select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange$={(e) => {
                              const checked = (e.target as HTMLInputElement).checked;

                              const raw = formData.value.services_requested;
                              const currentMap: Record<string, boolean> =
                                typeof raw === "string"
                                  ? (() => { try { return JSON.parse(raw); } catch { return {}; } })()
                                  : { ...((raw as Record<string, boolean>) || {}) };

                              currentMap[service.name] = checked;

                              formData.value = {
                                ...formData.value,
                                services_requested: { ...currentMap },
                              };
                            }}
                            class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                          <span class="truncate">{service.name}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <span class="text-sm text-gray-500 italic">No services available</span>
                )}
              </div>
            </div>

            {/* Scratch Notes on Profile (admin_notes) */}
            <div class="flex flex-col gap-4 mb-8">
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Scratch Notes on Profile
                </label>
                <textarea
                  value={formData.value.admin_notes || ""}
                  placeholder="Add internal notes..."
                  onInput$={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    formData.value = { ...formData.value, admin_notes: target.value };
                    autoResizeTextarea(target);
                  }}
                  class="auto-expand w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-hidden min-h-[80px]"
                />
              </div>
            </div>

            {/* Step 1 Footer Actions */}
            <div class="flex justify-end items-center gap-2">
              <button
                type="button"
                onClick$={onClose$}
                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick$={() => (step.value = "message")}
                class="min-w-[130px] h-[42px] px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Custom Email Message</span>
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Custom Message View */
          <div class="space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-green-600">
                Step 2 of 2
              </span>
              <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                Add Approval Message
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Include an optional custom message to send along with the approval email to{" "}
                <span class="font-semibold text-gray-800">{formData.value.email || "the customer"}</span>.
              </p>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={localCustomMessage.value}
                onInput$={(e) => {
                  const val = (e.target as HTMLTextAreaElement).value;
                  localCustomMessage.value = val;
                  if (customMessage) customMessage.value = val;
                }}
                placeholder="e.g. We are excited to work on your lawn next week! Please make sure gates are unlocked."
                class="w-full h-36 p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
              />
            </div>

            {/* Step 2 Footer Actions */}
            <div class="flex justify-end items-center gap-3 pt-2">
              {!isSubmitting.value && !isSuccess.value && (
                <button
                  type="button"
                  onClick$={() => (step.value = "edit")}
                  class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick$={handleSave$}
                disabled={isSubmitting.value || isSuccess.value}
                class="min-w-[130px] h-[42px] px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-90 disabled:hover:bg-green-600"
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
                  <span>Send Approval & Email</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});