import { component$, useSignal, $ } from "@builder.io/qwik";

export interface JobProfile {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  services_requested?: Record<string, boolean> | string | null;
  is_commercial?: boolean | null;
  description?: string | null;
  [key: string]: any;
}

export interface JobRecord {
  id?: number | string | null;
  job_profile_id?: number | null;
  team_id?: number | null;
  scheduled_day?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  completed?: boolean | null;
  notes?: string | null;
  job_profile?: JobProfile | null;
  [key: string]: any;
}

export interface DailyJobsCardProps {
  job: JobRecord;
}

export const DailyJobsCard = component$<DailyJobsCardProps>(({ job }) => {
  const isExpanded = useSignal(false);
  const copied = useSignal(false);

  const profile = job.job_profile;
  const isCommercial = Boolean(profile?.is_commercial);
  const isCompleted = Boolean(job.completed);

  // Calculate elapsed time if start_time and end_time are provided
  const getDurationString = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return null;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const durationStr = getDurationString(job.start_time, job.end_time);

  const getFullAddress = (p?: JobProfile | null) => {
    if (!p) return "";
    const parts = [p.address, p.city, p.state, p.zip].filter(
      (val): val is string => Boolean(val && typeof val === "string" && val.trim() !== "")
    );
    return parts.join(", ");
  };

  const fullAddress = getFullAddress(profile);

  const copyAddress$ = $(async (e: Event) => {
    e.stopPropagation();
    if (!fullAddress) return;
    try {
      await navigator.clipboard.writeText(fullAddress);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  });

  const servicesObj =
    profile?.services_requested ||
    (profile as any)?.services ||
    (profile as any)?.requested_services ||
    {};

  const activeServices: string[] = typeof servicesObj === "object" && servicesObj !== null
    ? Object.entries(servicesObj)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([serviceName]) => serviceName)
    : typeof servicesObj === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(servicesObj);
            return typeof parsed === "object" && parsed !== null
              ? Object.entries(parsed)
                  .filter(([, enabled]) => Boolean(enabled))
                  .map(([serviceName]) => serviceName)
              : [servicesObj];
          } catch {
            return [servicesObj];
          }
        })()
      : [];

  return (
    <div class={`w-full bg-white rounded-xl overflow-hidden border-0 shadow-none transition-opacity ${isCompleted ? "opacity-75" : ""}`}>
      {/* Unexpanded Header Bar */}
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none gap-2 sm:gap-4"
        onClick$={() => (isExpanded.value = !isExpanded.value)}
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 w-full">
          <div class="flex items-center gap-2 min-w-0">
            <span class={`font-bold sm:font-semibold text-gray-900 text-sm sm:text-base truncate ${isCompleted ? "line-through text-gray-400" : ""}`}>
              {profile?.name || "Unnamed Job"}
            </span>

            {isCompleted && (
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-800 tracking-wider flex-shrink-0">
                Completed
              </span>
            )}

            {durationStr && (
              <span class="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 text-slate-600 flex-shrink-0">
                ⏱ {durationStr}
              </span>
            )}
          </div>

          {fullAddress && (
            <div class="flex items-center gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-slate-50/60 sm:bg-white shadow-none max-w-full">
                <span class="text-xs sm:text-sm text-gray-600 truncate max-w-[220px] xs:max-w-xs sm:max-w-sm">
                  {fullAddress}
                </span>

                <button
                  type="button"
                  class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded flex items-center justify-center flex-shrink-0"
                  onClick$={copyAddress$}
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

        <div class="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-gray-100">
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

      {/* Expanded Detailed Content Area */}
      {isExpanded.value && (
        <div class="p-3 sm:p-4 bg-slate-50/50 flex flex-col gap-4 sm:gap-6 text-sm text-gray-700 border-t border-slate-100">
          {/* Time Tracking & Status Info */}
          {(job.start_time || job.end_time) && (
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
                Job Schedule & Duration
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-sm">
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">Start Time</span>
                  <span class="text-gray-900 font-medium">
                    {job.start_time ? new Date(job.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                  </span>
                </div>
                <div>
                  <span class="block text-xs font-semibold text-gray-500 mb-0.5">End Time</span>
                  <span class="text-gray-900 font-medium">
                    {job.end_time ? new Date(job.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Personal / Company Information Section */}
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
              {isCommercial ? "Company Information" : "Personal Information"}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60 text-sm">
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                  {isCommercial ? "Company Contact Email" : "Email"}
                </span>
                <span class="text-gray-900 font-medium break-all">{profile?.email || "N/A"}</span>
              </div>
              <div>
                <span class="block text-xs font-semibold text-gray-500 mb-0.5">
                  {isCommercial ? "Business Phone" : "Phone Number"}
                </span>
                <span class="text-gray-900 font-medium">{profile?.phone_number || "N/A"}</span>
              </div>
              <div class="sm:col-span-2">
                <span class="block text-xs font-semibold text-gray-500 mb-0.5">Property Type</span>
                <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gray-200/80 text-gray-800">
                  {isCommercial ? "Commercial" : "Residential"}
                </span>
              </div>
            </div>
          </div>

          {/* Requested Services Bullet Points Section */}
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
              Requested Services
            </h4>
            <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60 text-sm">
              {activeServices.length > 0 ? (
                <ul class="space-y-2">
                  {activeServices.map((service, idx) => (
                    <li key={idx} class="flex items-center gap-2.5 text-gray-900 font-medium">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                      <span class="break-words">{service}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span class="text-gray-500 italic">No services selected</span>
              )}
            </div>
          </div>

          {/* Vertical Notes Sections */}
          <div class="flex flex-col gap-3 sm:gap-4">
            <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Job Notes
              </h4>
              <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{job.notes || "N/A"}</p>
            </div>
            <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
              </h4>
              <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{profile?.description || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});