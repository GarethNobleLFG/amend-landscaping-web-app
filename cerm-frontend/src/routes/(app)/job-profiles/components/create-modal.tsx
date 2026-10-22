import { component$, type Signal, type PropFunction, $, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";
import { IconX } from "./icons";
import { formatPhoneNumber } from "../../../../hooks/utils/formatters";

export interface ServiceItem {
    id: number;
    name: string;
    description: string;
}

interface CreateModalProps {
    formData: Signal<Partial<JobProfile>>;
    availableServices?: ServiceItem[];
    onClose$: PropFunction<() => void>;
    onSubmit$: PropFunction<() => any | Promise<any>>;
}

export const CreateModal = component$<CreateModalProps>(({ formData, availableServices = [], onClose$, onSubmit$ }) => {
    const isCommercial = Boolean(formData.value.is_commercial);

    // UI state signals for button loading, success animation, and error messages
    const isSubmitting = useSignal(false);
    const isSuccess = useSignal(false);
    const errorMessage = useSignal<string | null>(null);

    // Helper to adjust a textarea height dynamically to fit its content
    const autoResizeTextarea = $((el: HTMLTextAreaElement) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    });

    // Automatically recalculate heights for all textareas on modal initial mount
    useVisibleTask$(({ track }) => {
        track(() => formData.value);
        const textareas = document.querySelectorAll<HTMLTextAreaElement>("textarea.auto-expand");
        textareas.forEach((ta) => {
            ta.style.height = "auto";
            ta.style.height = `${ta.scrollHeight}px`;
        });
    });

    // Wrapped submit handler to drive CSS animations & error banners
    const handleCreate$ = $(async () => {
        if (isSubmitting.value || isSuccess.value) return;

        errorMessage.value = null;
        isSubmitting.value = true;

        try {
            const res = await onSubmit$();

            // Check for 201/200 HTTP status or success flag
            const isOk = res?.status === 201 || res?.status === 200 || res?.value?.success || res === true;

            if (isOk) {
                isSubmitting.value = false;
                isSuccess.value = true;

                setTimeout(() => {
                    onClose$();
                }, 1200);
            } else {
                isSubmitting.value = false;
                
                // Display specific error message from server or Zod failure
                const errorText =
                    res?.value?.message ||
                    res?.message ||
                    "Please fill out all required fields marked with * and try again.";
                errorMessage.value = errorText;
            }
        } catch (err: any) {
            console.error(err);
            isSubmitting.value = false;
            errorMessage.value = "An unexpected error occurred. Please try again.";
        }
    });

    // Safely resolve services_requested whether it's a JSON string or an object
    const rawServices = formData.value.services_requested;
    const currentServices: Record<string, boolean> =
        typeof rawServices === "string"
            ? (() => { try { return JSON.parse(rawServices); } catch { return {}; } })()
            : (rawServices as Record<string, boolean>) || {};

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            {/* CSS Animation Keyframes for Spinner and SVG Checkmark Drawing */}
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
                <button
                    type="button"
                    onClick$={onClose$}
                    disabled={isSubmitting.value || isSuccess.value}
                    class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                    title="Close Modal"
                >
                    <IconX class="w-5 h-5" />
                </button>

                {/* Header with Commercial Toggle/Indicator */}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {isCommercial ? "Create Commercial Profile" : "Create Profile"}
                        </span>
                        <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                            {formData.value.name || (isCommercial ? "New Company" : "New Job Profile")}
                        </h3>
                    </div>
                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-gray-700">
                            <input
                                type="checkbox"
                                checked={isCommercial}
                                onChange$={(e) => {
                                    const checked = (e.target as HTMLInputElement).checked;
                                    formData.value = { ...formData.value, is_commercial: checked };
                                }}
                                class="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            Commercial
                        </label>
                    </div>
                </div>

                {/* Pop-up Error Notification Banner */}
                {errorMessage.value && (
                    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800">
                        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div class="flex-1 text-sm font-medium">
                            <p class="font-bold mb-0.5">Validation / Creation Error</p>
                            <p class="text-xs text-red-700">{errorMessage.value}</p>
                        </div>
                        <button
                            type="button"
                            onClick$={() => (errorMessage.value = null)}
                            class="text-red-400 hover:text-red-600 p-1"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Form Element Wrapping inputs to enforce validation and handle submit */}
                <form preventdefault:submit onSubmit$={handleCreate$}>
                    {/* Personal / Company Information Form Fields */}
                    <div class="mb-6">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            {isCommercial ? "Company Information" : "Personal Information"}
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    {isCommercial ? "Company Name *" : "Name *"}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.value.name || ""}
                                    placeholder="Enter name"
                                    onInput$={(e) => (formData.value = { ...formData.value, name: (e.target as HTMLInputElement).value })}
                                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    {isCommercial ? "Company Contact Email *" : "Email *"}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.value.email || ""}
                                    placeholder="Enter email"
                                    onInput$={(e) => (formData.value = { ...formData.value, email: (e.target as HTMLInputElement).value })}
                                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    {isCommercial ? "Business Phone *" : "Phone Number *"}
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={18}
                                    value={formData.value.phone_number || ""}
                                    placeholder="+1 (555) 000-0000"
                                    onInput$={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        const formatted = formatPhoneNumber(target.value);
                                        target.value = formatted;
                                        formData.value = { ...formData.value, phone_number: formatted };
                                    }}
                                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    {isCommercial ? "Facility / Service Address *" : "Address *"}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.value.address || ""}
                                    placeholder="Enter address"
                                    onInput$={(e) => (formData.value = { ...formData.value, address: (e.target as HTMLInputElement).value })}
                                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div class="grid grid-cols-3 gap-2 sm:col-span-2">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.value.city || ""}
                                        placeholder="City"
                                        onInput$={(e) => (formData.value = { ...formData.value, city: (e.target as HTMLInputElement).value })}
                                        class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">State *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.value.state || ""}
                                        placeholder="State"
                                        onInput$={(e) => (formData.value = { ...formData.value, state: (e.target as HTMLInputElement).value })}
                                        class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Zip *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.value.zip || ""}
                                        placeholder="Zip"
                                        onInput$={(e) => (formData.value = { ...formData.value, zip: (e.target as HTMLInputElement).value })}
                                        class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    {isCommercial ? "Contract / Service Value ($)" : "Average Job Payout ($)"}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.value.job_payout ?? ""}
                                    placeholder="0.00"
                                    onInput$={(e) => {
                                        const val = (e.target as HTMLInputElement).value;
                                        formData.value = { ...formData.value, job_payout: val === "" ? undefined : parseFloat(val) };
                                    }}
                                    class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requested Services Checkbox Section */}
                    <div class="mb-6">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            Requested Services
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

                    {/* Scratch Notes Section */}
                    <div class="mb-8">
                        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Scratch Notes (Not Visible to Staff)
                            </label>
                            <textarea
                                value={formData.value.admin_notes || ""}
                                placeholder="Internal notes..."
                                onInput$={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    formData.value = { ...formData.value, admin_notes: target.value };
                                    autoResizeTextarea(target);
                                }}
                                class="auto-expand w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-hidden min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div class="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick$={onClose$}
                            disabled={isSubmitting.value || isSuccess.value}
                            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
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
                                <span>Create Profile</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});