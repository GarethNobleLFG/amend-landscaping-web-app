import { component$, type Signal, type PropFunction, $, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";
import { IconX } from "../../../../components/ui/icons";
import { formatPhoneNumber } from "../../../../utils/formatters";
import { useNotification } from "~/components/ui/notification-toast";
import { parseServices } from "~/utils/service-utils";
import { ServicesChecklist } from "~/components/ui/services-checklist";

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

    const isSubmitting = useSignal(false);
    const errorMessage = useSignal<string | null>(null);

    // Reactive services signal mapped from formData
    const servicesSignal = useSignal<Record<string, boolean>>(
        parseServices(formData.value.services_requested)
    );

    // Keep formData.value.services_requested synchronized with servicesSignal
    const handleServicesChange = $((updated: Record<string, boolean>) => {
        formData.value = { ...formData.value, services_requested: { ...updated } };
    });

    const autoResizeTextarea = $((el: HTMLTextAreaElement) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    });

    useVisibleTask$(({ track }) => {
        track(() => formData.value);
        const textareas = document.querySelectorAll<HTMLTextAreaElement>("textarea.auto-expand");
        textareas.forEach((ta) => {
            ta.style.height = "auto";
            ta.style.height = `${ta.scrollHeight}px`;
        });
    });

    const notify = useNotification();

    const handleCreate$ = $(async () => {
        if (isSubmitting.value) return;
        isSubmitting.value = true;
        notify.loading("Creating customer profile...");
        onClose$();

        try {
            const res = await onSubmit$();
            const isOk = res?.status === 200 || res?.status === 201 || res?.value?.success || res === true;

            if (isOk) {
                notify.success("Customer profile created successfully!");
            } else {
                notify.error(res?.value?.message || res?.message || "Please check all required fields.");
            }
        } catch (err) {
            console.error(err);
            notify.error("An unexpected error occurred. Please try again.");
        } finally {
            isSubmitting.value = false;
        }
    });

    const serviceKeys = availableServices.map((s) => s.name);

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div class="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                <button
                    type="button"
                    onClick$={onClose$}
                    disabled={isSubmitting.value}
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

                {errorMessage.value && (
                    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800">
                        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" />
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

                <form preventdefault:submit onSubmit$={handleCreate$}>
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
                            <div>
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
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 mb-1">
                                    Scheduled Frequency <span class="text-gray-400 font-normal">(Just for Notes)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.value.schedule || ""}
                                    placeholder="e.g. Weekly, As Needed"
                                    onInput$={(e) => {
                                        const val = (e.target as HTMLInputElement).value;
                                        formData.value = { ...formData.value, schedule: val };
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
                                        maxLength={2}
                                        value={formData.value.state || ""}
                                        placeholder="ST"
                                        onInput$={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            const cleaned = target.value.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 2);
                                            target.value = cleaned;
                                            formData.value = { ...formData.value, state: cleaned };
                                        }}
                                        class="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-500 mb-1">Zip *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.value.zip || ""}
                                        placeholder="Zip"
                                        onInput$={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            const cleaned = target.value.replace(/\D/g, "").slice(0, 10);
                                            target.value = cleaned;
                                            formData.value = { ...formData.value, zip: cleaned };
                                        }}
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

                    {/* Requested Services (Shared ServicesChecklist Component) */}
                    <div class="mb-6">
                        <ServicesChecklist
                            services={servicesSignal}
                            availableServiceKeys={serviceKeys}
                            onChange$={handleServicesChange}
                        />
                    </div>

                    {/* Scratch Notes Section */}
                    <div class="mb-8">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Scratch Notes (Not Visible to Staff)
                            </label>
                                                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">

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
                            disabled={isSubmitting.value}
                            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick$={handleCreate$}
                            disabled={isSubmitting.value}
                            class="min-w-[130px] h-[42px] px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span>{isSubmitting.value ? "Creating..." : "Create Profile"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});