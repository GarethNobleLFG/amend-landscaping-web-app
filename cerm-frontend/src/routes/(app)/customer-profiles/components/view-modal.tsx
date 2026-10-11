import { component$, type PropFunction } from "@builder.io/qwik";
import type { CustomerProfile } from "../../../../hooks/customer-handling";
import { IconX } from "./icons";

interface ViewModalProps {
    profile: CustomerProfile;
    onClose$: PropFunction<() => void>;
}

export const ViewModal = component$<ViewModalProps>(({ profile, onClose$ }) => {
    const isCommercial = Boolean(profile.is_commercial);
    const hasAddress = profile.address || profile.city || profile.state || profile.zip;
    const fullAddress = hasAddress
        ? `${profile.address || ""}, ${profile.city || ""} ${profile.state || ""} ${profile.zip || ""}`.trim()
        : "N/A";

    // Extract requested services from profile.services_requested dictionary object where value is true
    const servicesObj = (profile as any).services_requested || (profile as any).services || (profile as any).requested_services || {};
    const activeServices: string[] = typeof servicesObj === "object" && servicesObj !== null
        ? Object.entries(servicesObj)
            .filter(([_, enabled]) => Boolean(enabled))
            .map(([serviceName]) => serviceName)
        : [];

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div class="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick$={onClose$}
                    class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all"
                    title="Close Modal"
                >
                    <IconX class="w-5 h-5" />
                </button>

                {/* Header with Name/Company Name & Schedule Badge */}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {isCommercial ? "Commercial Profile" : "Customer Profile"}
                        </span>
                        <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                            {profile.name || "N/A"}
                        </h3>
                    </div>
                    <div>
                        <span class="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
                            {profile.schedule || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Personal / Company Information Section */}
                <div class="mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        {isCommercial ? "Company Information" : "Personal Information"}
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Company Contact Email" : "Email"}
                            </span>
                            <span class="text-gray-900 font-medium">{profile.email || "N/A"}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Business Phone" : "Phone Number"}
                            </span>
                            <span class="text-gray-900 font-medium">{profile.phone_number || "N/A"}</span>
                        </div>
                        <div class="sm:col-span-2">
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Facility / Service Address" : "Address"}
                            </span>
                            <span class="text-gray-900 font-medium">{fullAddress}</span>
                        </div>
                        <div class="sm:col-span-2">
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">Referral Info</span>
                            <span class="text-gray-900 font-medium">{profile.referral_info || "N/A"}</span>
                        </div>
                        <div class="sm:col-span-2">
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Contract / Service Value" : "Average Job Payout"}
                            </span>
                            <span class="text-gray-900 font-medium">
                                {profile.job_payout != null
                                    ? `$${Number(profile.job_payout).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Requested Services Bullet Points Section */}
                <div class="mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Requested Services
                    </h4>
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
                        {activeServices.length > 0 ? (
                            <ul class="space-y-2">
                                {activeServices.map((service, idx) => (
                                    <li key={idx} class="flex items-center gap-2.5 text-gray-900 font-medium">
                                        <span class="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                                        <span>{service}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span class="text-gray-500 italic">No services selected</span>
                        )}
                    </div>
                </div>

                {/* Vertical Notes Sections */}
                <div class="flex flex-col gap-4 mb-8">
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            Admin Notes (Visible to Staff)
                        </h4>
                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{profile.admin_notes || "N/A"}</p>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
                        </h4>
                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{profile.description || "N/A"}</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div class="flex justify-end">
                    <button
                        onClick$={onClose$}
                        class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
});