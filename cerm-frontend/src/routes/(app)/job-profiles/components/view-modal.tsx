import { component$, type PropFunction } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";
import { IconX } from "../../../../components/ui/icons";
import { ServicesList } from "~/components/ui/services-list";

interface ViewModalProps {
    profile: JobProfile;
    onClose$: PropFunction<() => void>;
}

export const ViewModal = component$<ViewModalProps>(({ profile, onClose$ }) => {
    const isCommercial = Boolean(profile.is_commercial);

    const cityStateZip = [profile.city, profile.state, profile.zip]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(" ");

    const addressParts = [profile.address?.trim(), cityStateZip].filter(Boolean);
    const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "N/A";

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div class="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick$={onClose$}
                    class="absolute top-3.5 right-3.5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all cursor-pointer"
                    title="Close Modal"
                >
                    <IconX class="w-5 h-5" />
                </button>

                {/* Header with Name/Company Name */}
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 pr-8">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {isCommercial ? "Commercial Profile" : "Job Profile"}
                        </span>
                        <h3 class="text-2xl font-extrabold text-gray-900 mt-0.5">
                            {profile.name || "N/A"}
                        </h3>
                    </div>
                </div>

                {/* Personal / Company Information Section */}
                <div class="mb-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                        {isCommercial ? "Company Information" : "Personal Information"}
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Company Contact Email" : "Email"}
                            </span>
                            <span class="text-gray-900 font-medium break-all">{profile.email || "N/A"}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Business Phone" : "Phone Number"}
                            </span>
                            <span class="text-gray-900 font-medium">{profile.phone_number || "N/A"}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">Scheduled Frequency</span>
                            <span class="text-gray-900 font-medium">{profile.schedule || "N/A"}</span>
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">Referral Info</span>
                            <span class="text-gray-900 font-medium">{profile.referral_info || "N/A"}</span>
                        </div>
                        <div class="sm:col-span-2">
                            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                                {isCommercial ? "Facility / Service Address" : "Address"}
                            </span>
                            <span class="text-gray-900 font-medium break-words">{fullAddress}</span>
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

                {/* Requested Services (Shared ServicesList Component) */}
                <div class="mb-6">
                    <ServicesList
                        services={profile.services_requested}
                        title="Requested Services"
                    />
                </div>

                {/* Notes Sections */}
                <div class="flex flex-col gap-5 mb-6">
                    <div class="flex flex-col gap-2.5">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {isCommercial ? "Company Description" : "Profile Description"}
                        </h4>
                        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                {profile.description || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2.5">
                        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Scratch Notes (Not Visible to Staff)
                        </h4>
                        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                {profile.admin_notes || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div class="flex justify-end">
                    <button
                        onClick$={onClose$}
                        class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
});