import { component$, type Signal, type PropFunction, $, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { CustomerProfile } from "../../../../hooks/customer-handling";
import { IconX } from "./icons";

export interface ServiceItem {
    id: number;
    name: string;
    description: string;
}

interface EditModalProps {
    formData: Signal<Partial<CustomerProfile>>;
    availableServices?: ServiceItem[];
    onClose$: PropFunction<() => void>;
    onSubmit$: PropFunction<() => any | Promise<any>>;
}

export const EditModal = component$<EditModalProps>(({ formData, availableServices = [], onClose$, onSubmit$ }) => {
    const isCommercial = Boolean(formData.value.is_commercial);

    // UI state signals for button loading/success animation
    const isSubmitting = useSignal(false);
    const isSuccess = useSignal(false);

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

    // Wrapped submit handler to drive CSS animations & timing lock
    const handleSave$ = $(async () => {
        if (isSubmitting.value || isSuccess.value) return;

        isSubmitting.value = true;

        try {
            const res = await onSubmit$();

            // Check for 200 status or success response
            const isOk = res?.status === 200 || res?.value?.success || res === true;

            if (isOk) {
                isSubmitting.value = false;
                isSuccess.value = true;

                // Keep modal open so the full checkmark drawing & hold animation plays out
                setTimeout(() => {
                    onClose$();
                }, 1200); // 600ms drawing + 600ms hold time
            } else {
                isSubmitting.value = false;
            }
        } catch (err) {
            isSubmitting.value = false;
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
                    onClick$={onClose$}
                    disabled={isSubmitting.value || isSuccess.value}
                    class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                    title="Close Modal"
                >
                    <IconX class="w-5 h-5" />
                </button>

                {/* Header with Schedule Badge Preview */}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {isCommercial ? "Edit Commercial Profile" : "Edit Profile"}
                        </span>
                        <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                            {formData.value.name || (isCommercial ? "Company" : "Customer")}
                        </h3>
                    </div>
                    <div>
                        <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
                            {formData.value.schedule || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Personal / Company Information Form Fields */}
                <div class="mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        {isCommercial ? "Company Information" : "Personal Information"}
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1">
                                {isCommercial ? "Company Name" : "Name"}
                            </label>
                            <input
                                type="text"
                                value={formData.value.name || ""}
                                placeholder="N/A"
                                onInput$={(e) => (formData.value = { ...formData.value, name: (e.target as HTMLInputElement).value })}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1">
                                {isCommercial ? "Company Contact Email" : "Email"}
                            </label>
                            <input
                                type="email"
                                value={formData.value.email || ""}
                                placeholder="N/A"
                                onInput$={(e) => (formData.value = { ...formData.value, email: (e.target as HTMLInputElement).value })}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1">
                                {isCommercial ? "Business Phone" : "Phone Number"}
                            </label>
                            <input
                                type="text"
                                value={formData.value.phone_number || ""}
                                placeholder="N/A"
                                onInput$={(e) => (formData.value = { ...formData.value, phone_number: (e.target as HTMLInputElement).value })}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1">Schedule Frequency</label>
                            <input
                                type="text"
                                value={formData.value.schedule || ""}
                                placeholder="N/A"
                                onInput$={(e) => (formData.value = { ...formData.value, schedule: (e.target as HTMLInputElement).value })}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-semibold text-gray-500 mb-1">
                                {isCommercial ? "Facility / Service Address" : "Address"}
                            </label>
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
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-semibold text-gray-500 mb-1">Referral Info</label>
                            <input
                                type="text"
                                value={formData.value.referral_info || ""}
                                placeholder="N/A"
                                onInput$={(e) => (formData.value = { ...formData.value, referral_info: (e.target as HTMLInputElement).value })}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-semibold text-gray-500 mb-1">
                                {isCommercial ? "Contract / Service Value ($)" : "Average Job Payout ($)"}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.value.job_payout ?? ""}
                                placeholder="N/A"
                                onInput$={(e) => {
                                    const val = (e.target as HTMLInputElement).value;
                                    formData.value = { ...formData.value, job_payout: val === "" ? undefined : parseFloat(val) };
                                }}
                                class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Requested Services Checkbox Section (Single Column Layout) */}
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

                {/* Vertical Auto-Expanding Notes Sections */}
                <div class="flex flex-col gap-4 mb-8">
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            Admin Notes (Visible to Staff)
                        </label>
                        <textarea
                            value={formData.value.admin_notes || ""}
                            placeholder="N/A"
                            onInput$={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                formData.value = { ...formData.value, admin_notes: target.value };
                                autoResizeTextarea(target);
                            }}
                            class="auto-expand w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-hidden min-h-[80px]"
                        />
                    </div>
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
                        </label>
                        <textarea
                            value={formData.value.description || ""}
                            placeholder="N/A"
                            onInput$={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                formData.value = { ...formData.value, description: target.value };
                                autoResizeTextarea(target);
                            }}
                            class="auto-expand w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-hidden min-h-[80px]"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div class="flex justify-end gap-2">
                    <button
                        onClick$={onClose$}
                        disabled={isSubmitting.value || isSuccess.value}
                        class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
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
                            <span>Save Changes</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});