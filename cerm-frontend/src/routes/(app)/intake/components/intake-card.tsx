import { component$, type PropFunction } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";

interface IntakeCardProps {
  profile: JobProfile;
  onApprove$: PropFunction<(profile: JobProfile) => void>;
  onDeny$: PropFunction<(profile: JobProfile) => void>;
  onViewDescription$: PropFunction<(description: string, title?: string) => void>;
}

export const IntakeCard = component$<IntakeCardProps>(
  ({ profile, onApprove$, onDeny$, onViewDescription$ }) => {
    // 1. Safely parse services into a list of strings
    let serviceItems: string[] = [];
    const rawServices: unknown = profile.services_requested;

    if (typeof rawServices === "string") {
      try {
        const parsed = JSON.parse(rawServices);
        if (Array.isArray(parsed)) {
          serviceItems = parsed.map((item) => String(item));
        } else if (typeof parsed === "object" && parsed !== null) {
          serviceItems = Object.entries(parsed).map(([key, val]) =>
            typeof val === "boolean" && val ? key : `${key}: ${String(val)}`
          );
        }
      } catch {
        const strVal = String(rawServices).trim();
        if (strVal) {
          serviceItems = [strVal];
        }
      }
    } else if (Array.isArray(rawServices)) {
      serviceItems = rawServices.map((item) => String(item));
    } else if (rawServices && typeof rawServices === "object") {
      serviceItems = Object.entries(rawServices as Record<string, unknown>).map(([key, val]) =>
        typeof val === "boolean" && val ? key : `${key}: ${String(val)}`
      );
    }

    // 2. Determine description truncation
    const rawDescription = profile.description || "No description provided.";
    const isLongDescription = rawDescription.length > 60 || rawDescription.includes("\n");

    return (
      <div class="bg-white border-0 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4">
        {/* Header */}
        <div class="border-b border-slate-100 pb-3 flex justify-between items-start gap-2">
          <h3 class="text-lg font-bold text-slate-900">{profile.name || "Unnamed Request"}</h3>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
            {profile.is_commercial ? "Commercial Intake" : "Residential Intake"}
          </span>
        </div>

        {/* Content */}
        <div class="space-y-3 text-xs text-slate-700">
          <div>
            <span class="font-semibold text-slate-900 block">Email</span>
            <span class="text-slate-600">{profile.email || "N/A"}</span>
          </div>

          <div>
            <span class="font-semibold text-slate-900 block">Phone Number</span>
            <span class="text-slate-600">{profile.phone_number || "N/A"}</span>
          </div>

          <div>
            <span class="font-semibold text-slate-900 block">Address</span>
            <span class="text-slate-600">
              {[profile.address, profile.city, profile.state, profile.zip].filter(Boolean).join(", ") || "N/A"}
            </span>
          </div>

          <div>
            <span class="font-semibold text-slate-900 block">Referral Info</span>
            <span class="text-slate-600">{profile.referral_info || "None"}</span>
          </div>

          {/* Requested Services Bullet List with Green Bullets */}
          <div>
            <span class="font-semibold text-slate-900 block mb-1">REQUESTED SERVICES</span>
            {serviceItems.length > 0 ? (
              <ul class="list-disc list-inside bg-slate-50 border-0 rounded-lg p-2.5 space-y-1 text-slate-800 text-[11px] marker:text-green-600">
                {serviceItems.map((service, idx) => (
                  <li key={idx} class="capitalize">
                    {service}
                  </li>
                ))}
              </ul>
            ) : (
              <p class="bg-slate-50 border-0 rounded-lg p-2.5 text-slate-400 italic text-[11px]">
                No services listed
              </p>
            )}
          </div>

          {/* Description with Truncation */}
          <div>
            <span class="font-semibold text-slate-900 block mb-1">Description</span>
            <div class="bg-slate-50 border-0 rounded-lg p-2.5 text-slate-600 text-xs">
              <p class="truncate">{rawDescription}</p>
              {isLongDescription && (
                <button
                  onClick$={() => onViewDescription$(rawDescription, profile.name)}
                  class="mt-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View full text &rarr;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-3 pt-3 border-t border-slate-100">
          <button
            onClick$={() => onApprove$(profile)}
            class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
          >
            Approve
          </button>

          <button
            onClick$={() => onDeny$(profile)}
            class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
          >
            Deny
          </button>
        </div>
      </div>
    );
  }
);