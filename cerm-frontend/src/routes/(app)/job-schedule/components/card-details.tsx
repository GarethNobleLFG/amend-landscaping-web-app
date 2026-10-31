import { component$ } from "@builder.io/qwik";

export interface CardDetailsProps {
  startTime?: string | null;
  endTime?: string | null;
  isCommercial: boolean;
  email?: string | null;
  phoneNumber?: string | null;
  services: string[];
  jobNotes?: string | null;
  clientNotes?: string | null;
}

export const CardDetails = component$<CardDetailsProps>(({
  startTime,
  endTime,
  isCommercial,
  email,
  phoneNumber,
  services,
  jobNotes,
  clientNotes,
}) => {
  return (
    <div class="p-3 sm:p-4 bg-slate-50/50 flex flex-col gap-4 sm:gap-6 text-sm text-gray-700 border-t border-slate-100">
      {/* Time Tracking Info */}
      {(startTime || endTime) && (
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
            Job Schedule & Duration
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-sm">
            <div>
              <span class="block text-xs font-semibold text-gray-500 mb-0.5">Start Time</span>
              <span class="text-gray-900 font-medium">
                {startTime ? new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
              </span>
            </div>
            <div>
              <span class="block text-xs font-semibold text-gray-500 mb-0.5">End Time</span>
              <span class="text-gray-900 font-medium">
                {endTime ? new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
          {isCommercial ? "Company Information" : "Personal Information"}
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60 text-sm">
          <div>
            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
              {isCommercial ? "Company Contact Email" : "Email"}
            </span>
            <span class="text-gray-900 font-medium break-all">{email || "N/A"}</span>
          </div>
          <div>
            <span class="block text-xs font-semibold text-gray-500 mb-0.5">
              {isCommercial ? "Business Phone" : "Phone Number"}
            </span>
            <span class="text-gray-900 font-medium">{phoneNumber || "N/A"}</span>
          </div>
          <div class="sm:col-span-2">
            <span class="block text-xs font-semibold text-gray-500 mb-0.5">Property Type</span>
            <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-gray-200/80 text-gray-800">
              {isCommercial ? "Commercial" : "Residential"}
            </span>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 sm:mb-3">
          Requested Services
        </h4>
        <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60 text-sm">
          {services.length > 0 ? (
            <ul class="space-y-2">
              {services.map((service, idx) => (
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

      {/* Notes */}
      <div class="flex flex-col gap-3 sm:gap-4">
        <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Job Notes
          </h4>
          <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{jobNotes || "N/A"}</p>
        </div>
        <div class="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/60">
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {isCommercial ? "Commercial Client Notes" : "Customer Submitted Notes"}
          </h4>
          <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{clientNotes || "N/A"}</p>
        </div>
      </div>
    </div>
  );
});