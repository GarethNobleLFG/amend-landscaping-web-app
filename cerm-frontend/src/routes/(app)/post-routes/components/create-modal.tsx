import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";
import type { Team } from "~/hooks/teams-handling";
import type { JobProfile } from "~/hooks/job-profile-handling";
import { IconX } from "../../../../components/ui/icons";

interface CreateModalProps {
  selectedDateStr: string; // Format: YYYY-MM-DD
  profiles: JobProfile[];
  teams: Team[];
  createAction: any;
  onClose$: PropFunction<() => void>;
}

export const CreateModal = component$(({ selectedDateStr, profiles, teams, createAction, onClose$ }: CreateModalProps) => {
  const selectedProfileId = useSignal<number | null>(profiles.length > 0 ? profiles[0].id : null);
  const selectedTeamId = useSignal<number | null>(teams.length > 0 ? teams[0].id : null);
  const scheduledDayInput = useSignal(selectedDateStr);
  const notesInput = useSignal("");

  const profileSearch = useSignal("");
  const teamSearch = useSignal("");
  const isProfileDropdownOpen = useSignal(false);
  const isTeamDropdownOpen = useSignal(false);

  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);
  const errorMessage = useSignal("");

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((p) =>
    (p.name || "").toLowerCase().includes(profileSearch.value.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(profileSearch.value.toLowerCase())
  );

  // Filter teams based on search query
  const filteredTeams = teams.filter((t) =>
    (t.name || "").toLowerCase().includes(teamSearch.value.toLowerCase())
  );

  const activeProfile = profiles.find((p) => p.id === selectedProfileId.value);
  const activeTeam = teams.find((t) => t.id === selectedTeamId.value);

  const handleSubmit = $(async () => {
    if (isSubmitting.value || isSuccess.value) return;
    if (!selectedProfileId.value) {
      errorMessage.value = "Please select a job profile";
      return;
    }
    if (!selectedTeamId.value) {
      errorMessage.value = "Please select a team";
      return;
    }
    if (!scheduledDayInput.value) {
      errorMessage.value = "Scheduled date is required";
      return;
    }

    isSubmitting.value = true;
    errorMessage.value = "";

    try {
      const res = await createAction.submit({
        job_profile_id: selectedProfileId.value,
        team_id: selectedTeamId.value,
        scheduled_day: scheduledDayInput.value,
        notes: notesInput.value,
      });

      const isOk = res?.status === 200 || res?.value?.success;

      if (isOk) {
        isSubmitting.value = false;
        isSuccess.value = true;
        setTimeout(() => {
          onClose$();
        }, 1200);
      } else {
        isSubmitting.value = false;
        errorMessage.value = res?.value?.message || "Failed to create scheduled job";
      }
    } catch {
      isSubmitting.value = false;
      errorMessage.value = "Network error. Please try again.";
    }
  });

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick$={onClose$}
          disabled={isSubmitting.value || isSuccess.value}
          class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer"
        >
          <IconX class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-extrabold text-gray-900 mb-1">Schedule New Job</h3>
        <p class="text-xs text-gray-500 mb-6">Assign a job profile and team for {scheduledDayInput.value}.</p>

        {errorMessage.value && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {errorMessage.value}
          </div>
        )}

        <div class="space-y-4 mb-6">
          {/* 1. Job Profile Typeahead Dropdown */}
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 mb-1">Job Profile *</label>
            <div
              onClick$={() => (isProfileDropdownOpen.value = !isProfileDropdownOpen.value)}
              class="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm flex items-center justify-between cursor-pointer"
            >
              <span class={activeProfile ? "text-gray-900 font-medium" : "text-gray-400"}>
                {activeProfile ? activeProfile.name : "Select or search job profile..."}
              </span>
              <span class="text-xs text-gray-400">&#9660;</span>
            </div>

            {isProfileDropdownOpen.value && (
              <div class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 space-y-2">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={profileSearch.value}
                  onInput$={(e) => (profileSearch.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-3 py-1.5 bg-slate-50 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                <div class="max-h-40 overflow-y-auto space-y-1">
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((p) => (
                      <div
                        key={p.id}
                        onClick$={() => {
                          selectedProfileId.value = p.id;
                          isProfileDropdownOpen.value = false;
                        }}
                        class="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl cursor-pointer transition-all"
                      >
                        {p.name} {p.email ? `(${p.email})` : ""}
                      </div>
                    ))
                  ) : (
                    <div class="px-3 py-2 text-xs text-gray-400 italic">No profiles found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Team Typeahead Dropdown */}
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 mb-1">Assigned Team *</label>
            <div
              onClick$={() => (isTeamDropdownOpen.value = !isTeamDropdownOpen.value)}
              class="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm flex items-center justify-between cursor-pointer"
            >
              <div class="flex items-center gap-2">
                {activeTeam?.team_color && (
                  <div class="w-3 h-3 rounded-full" style={{ backgroundColor: activeTeam.team_color }} />
                )}
                <span class={activeTeam ? "text-gray-900 font-medium" : "text-gray-400"}>
                  {activeTeam ? activeTeam.name : "Select or search team..."}
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

          {/* 3. Scheduled Day (Pre-filled & Editable) */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Scheduled Date *</label>
            <input
              type="date"
              required
              value={scheduledDayInput.value}
              onInput$={(e) => (scheduledDayInput.value = (e.target as HTMLInputElement).value)}
              class="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 4. Notes Section */}
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Job Specific Notes (Visible to Employees) (Optional)</label>
            <textarea
              rows={3}
              value={notesInput.value}
              onInput$={(e) => (notesInput.value = (e.target as HTMLTextAreaElement).value)}
              placeholder="Add job instructions or notes..."
              class="w-full px-3 py-2 bg-slate-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick$={onClose$}
            disabled={isSubmitting.value || isSuccess.value}
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick$={handleSubmit}
            disabled={isSubmitting.value || isSuccess.value}
            class="min-w-[125px] h-[38px] px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-90 cursor-pointer"
          >
            {isSuccess.value ? (
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : isSubmitting.value ? (
              <div class="css-spinner" />
            ) : (
              <span>Schedule Job</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});