import { component$, useSignal, useVisibleTask$, $, type PropFunction } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";
import type { JobProfile, PaginatedJobProfilesResponse } from "~/hooks/job-profile-handling";
import type { Service } from "~/hooks/amend-api-handling";
import { IconX } from "../../../../components/ui/icons";
import { useNotification } from "~/components/ui/notification-toast";
import { parseServices } from "~/utils/service-utils";
import { ServicesChecklist } from "~/components/ui/services-checklist";
import { AutoResizeTextarea } from "~/components/ui/auto-resize-textarea";

interface CreateModalProps {
  selectedDateStr: string; // Format: YYYY-MM-DD
  teams: Team[];
  availableServices?: Service[];
  createAction: any;
  searchProfiles$?: PropFunction<
    (params: {
      q: string;
      limit?: number;
      offset?: number;
      token?: string;
    }) => Promise<PaginatedJobProfilesResponse>
  >;
  onClose$: PropFunction<() => void>;
}

export const CreateModal = component$(({
  selectedDateStr,
  teams,
  availableServices = [],
  createAction,
  searchProfiles$,
  onClose$,
}: CreateModalProps) => {
  const selectedTeamId = useSignal<number | null>(teams.length > 0 ? teams[0].id : null);
  const scheduledDayInput = useSignal(selectedDateStr);
  const notesInput = useSignal("");

  const selectedProfile = useSignal<JobProfile | null>(null);
  const searchResults = useSignal<JobProfile[]>([]);
  const isSearchingProfiles = useSignal(false);

  // Requested services signal, prefilled from the selected customer profile
  const selectedServices = useSignal<Record<string, boolean>>({});

  const profileSearch = useSignal("");
  const teamSearch = useSignal("");
  const isProfileDropdownOpen = useSignal(false);
  const isTeamDropdownOpen = useSignal(false);
  const profileBoxRef = useSignal<HTMLElement>();

  const isSubmitting = useSignal(false);
  const errorMessage = useSignal("");
  const notify = useNotification();

  // Close profile results dropdown when clicking outside the profile field/dropdown
  useVisibleTask$(({ cleanup }) => {
    const handlePointerDown = (event: PointerEvent) => {
      const container = profileBoxRef.value;
      const target = event.target as Node | null;
      if (container && target && !container.contains(target)) {
        isProfileDropdownOpen.value = false;
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    cleanup(() => {
      document.removeEventListener("pointerdown", handlePointerDown);
    });
  });

  // Fetch matching approved job profiles when dropdown is open and query changes
  useVisibleTask$(({ track, cleanup }) => {
    const query = track(() => profileSearch.value).trim();
    const isOpen = track(() => isProfileDropdownOpen.value);

    if (!isOpen || !searchProfiles$ || !query) {
      searchResults.value = [];
      isSearchingProfiles.value = false;
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      isSearchingProfiles.value = true;
      try {
        const res = await searchProfiles$({ q: query, limit: 20, offset: 0 });
        if (!cancelled) {
          searchResults.value = res.items ?? [];
        }
      } catch {
        if (!cancelled) {
          searchResults.value = [];
        }
      } finally {
        if (!cancelled) {
          isSearchingProfiles.value = false;
        }
      }
    }, 200);

    cleanup(() => {
      cancelled = true;
      clearTimeout(timer);
    });
  });

  const filteredTeams = teams.filter((t) =>
    (t.name || "").toLowerCase().includes(teamSearch.value.toLowerCase())
  );
  const activeTeam = teams.find((t) => t.id === selectedTeamId.value);

  const serviceKeys = availableServices.length > 0
    ? availableServices.map((s) => s.name)
    : [];

  const applyProfileServices = $((profile: JobProfile | null) => {
    if (!profile) {
      selectedServices.value = {};
      return;
    }

    const parsed = parseServices(profile.services_requested);
    const nextServices: Record<string, boolean> = {};
    for (const key of serviceKeys) {
      nextServices[key] = Boolean(parsed[key]);
    }
    for (const [key, val] of Object.entries(parsed)) {
      if (!(key in nextServices)) {
        nextServices[key] = Boolean(val);
      }
    }
    selectedServices.value = nextServices;
  });

  const handleSubmit = $(async () => {
    if (isSubmitting.value) return;
    if (!selectedProfile.value || !scheduledDayInput.value) {
      errorMessage.value = "Customer profile and scheduled day are required.";
      return;
    }

    errorMessage.value = "";
    isSubmitting.value = true;
    notify.loading("Scheduling job...");
    onClose$();

    try {
      const res = await createAction.submit({
        job_profile_id: selectedProfile.value.id,
        team_id: selectedTeamId.value,
        scheduled_day: scheduledDayInput.value,
        notes: notesInput.value ? notesInput.value : null,
        services_requested: selectedServices.value,
      });

      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        notify.success("Job scheduled successfully!");
      } else {
        notify.error(res?.value?.message || "Failed to schedule job.");
      }
    } catch {
      notify.error("Network error. Please try again.");
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick$={onClose$}
          disabled={isSubmitting.value}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
        >
          <IconX class="w-5 h-5" />
        </button>

        <h3 class="text-2xl font-extrabold text-gray-900 mb-6">Schedule New Job</h3>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        <div class="space-y-5 mb-6">
          {/* 1. Job Profile Typeahead Input + Dropdown */}
          <div ref={profileBoxRef} class="relative">
            <label class="block text-xs font-semibold text-gray-500 mb-1">Job Profile *</label>
            <div class="relative flex items-center">
              <input
                type="text"
                placeholder="Search approved profiles by name..."
                value={profileSearch.value}
                onFocus$={() => {
                  isProfileDropdownOpen.value = true;
                }}
                onInput$={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  profileSearch.value = val;
                  if (selectedProfile.value && val !== selectedProfile.value.name) {
                    selectedProfile.value = null;
                  }
                  isProfileDropdownOpen.value = true;
                }}
                class="w-full px-3.5 py-2.5 pr-9 bg-slate-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {selectedProfile.value && (
                <button
                  type="button"
                  onClick$={async () => {
                    selectedProfile.value = null;
                    profileSearch.value = "";
                    searchResults.value = [];
                    isProfileDropdownOpen.value = false;
                    await applyProfileServices(null);
                  }}
                  aria-label="Clear selected profile"
                  class="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <IconX class="w-4 h-4" />
                </button>
              )}
            </div>

            {isProfileDropdownOpen.value && (
              <div class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 max-h-48 overflow-y-auto space-y-1">
                {!profileSearch.value.trim() ? (
                  <div class="px-3 py-2 text-xs text-gray-400 italic">Start searching</div>
                ) : isSearchingProfiles.value ? (
                  <div class="px-3 py-2 text-xs text-gray-400 italic">Searching profiles...</div>
                ) : searchResults.value.length > 0 ? (
                  searchResults.value.map((profile) => (
                    <div
                      key={profile.id}
                      onClick$={async () => {
                        selectedProfile.value = profile;
                        profileSearch.value = profile.name;
                        isProfileDropdownOpen.value = false;
                        await applyProfileServices(profile);
                      }}
                      class="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                    >
                      <span class="font-semibold">{profile.name}</span>
                      <span class="text-[11px] text-gray-400">
                        {profile.is_commercial ? "Commercial" : "Residential"}
                        {profile.city ? ` • ${profile.city}` : profile.address ? ` • ${profile.address}` : ""}
                      </span>
                    </div>
                  ))
                ) : (
                  <div class="px-3 py-2 text-xs text-gray-400 italic">No matching profiles found</div>
                )}
              </div>
            )}
          </div>

          {/* 2. Team Typeahead Dropdown */}
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 mb-1">Assigned Team *</label>
            <div
              onClick$={() => (isTeamDropdownOpen.value = !isTeamDropdownOpen.value)}
              class="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm flex items-center justify-between cursor-pointer"
            >
              <div class="flex items-center gap-2">
                {activeTeam?.team_color && (
                  <div class="w-3 h-3 rounded-full" style={{ backgroundColor: activeTeam.team_color }} />
                )}
                <span class={activeTeam ? "text-gray-900 font-medium" : "text-gray-400"}>
                  {activeTeam ? activeTeam.name : "Select team..."}
                </span>
              </div>
              <span class="text-xs text-gray-400">&#9660;</span>
            </div>

            {isTeamDropdownOpen.value && (
              <div class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 space-y-2">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={teamSearch.value}
                  onInput$={(e) => (teamSearch.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-1.5 bg-slate-50 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                <div class="max-h-40 overflow-y-auto space-y-1">
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((t) => (
                      <div
                        key={t.id}
                        onClick$={() => {
                          selectedTeamId.value = t.id;
                          isTeamDropdownOpen.value = false;
                        }}
                        class="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl cursor-pointer transition-all flex items-center gap-2"
                      >
                        {t.team_color && (
                          <div class="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.team_color }} />
                        )}
                        <span>{t.name}</span>
                      </div>
                    ))
                  ) : (
                    <div class="px-3 py-2 text-xs text-gray-400 italic">No teams found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Scheduled Day */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Scheduled Date *</label>
            <input
              type="date"
              required
              value={scheduledDayInput.value}
              onInput$={(e) => (scheduledDayInput.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 4. Requested Services Checklist */}
          <ServicesChecklist
            services={selectedServices}
            availableServiceKeys={serviceKeys}
            label="Requested Services for This Job"
            titleClass="block text-xs font-semibold text-gray-500 mb-1"
          />

          <AutoResizeTextarea
            id="create-job-notes"
            label="Job Specific Notes (Visible to Crew)"
            signal={notesInput}
            rows={3}
            minHeight={88}
            placeholder="Instructions or notes for this job..."
          />
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value}
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={isSubmitting.value}
            class="min-w-[130px] h-[42px] px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting.value ? "Scheduling..." : "Schedule Job"}</span>
          </button>
        </div>
      </div>
    </div>
  );
});