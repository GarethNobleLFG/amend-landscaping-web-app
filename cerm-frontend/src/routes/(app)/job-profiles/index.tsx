import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import {
  useApprovedProfiles,
  useCreateJobProfile,
  useUpdateJobProfile,
  useDeleteJobProfile,
  searchApprovedProfiles,
  type JobProfile,
  type PaginatedApprovedJobProfilesResponse,
} from "../../../hooks/job-profile-handling";
import { useAmendServices } from "../../../hooks/amend-api-handling";
import { JobCard } from "./components/job-card";
import { ViewModal } from "./components/view-modal";
import { EditModal } from "./components/edit-modal";
import { CreateModal } from "./components/create-modal";
import { DeleteModal } from "../../../components/ui/delete-modal";

export { useApprovedProfiles, useCreateJobProfile, useUpdateJobProfile, useDeleteJobProfile, useAmendServices };

// Search Icon Component
const IconSearch = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
));

export default component$(() => {
  const nav = useNavigate();
  const profilesSignal = useApprovedProfiles();
  const servicesSignal = useAmendServices();
  const createAction = useCreateJobProfile();
  const updateAction = useUpdateJobProfile();
  const deleteAction = useDeleteJobProfile();

  const selectedProfile = useSignal<JobProfile | null>(null);
  const activeModal = useSignal<"view" | "edit" | "delete" | "create" | null>(null);
  const editFormData = useSignal<Partial<JobProfile>>({});
  const createFormData = useSignal<Partial<JobProfile>>({});

  // Tab state: 'residential' (non-commercial) vs 'commercial'
  const activeTab = useSignal<"residential" | "commercial">("residential");

  // Search state
  const searchQuery = useSignal("");
  const searchResults = useSignal<PaginatedApprovedJobProfilesResponse | null>(null);
  const isSearching = useSignal(false);
  const searchError = useSignal("");
  const searchLimit = useSignal(20);
  const searchOffset = useSignal(0);

  const runSearch = $(async (q: string, tab: "residential" | "commercial", limit: number, offset: number) => {
    const trimmed = q.trim();
    if (!trimmed) {
      searchResults.value = null;
      searchError.value = "";
      isSearching.value = false;
      return;
    }

    isSearching.value = true;
    searchError.value = "";
    try {
      searchResults.value = await searchApprovedProfiles({
        q: trimmed,
        type: tab,
        limit,
        offset,
      });
    } catch (err: any) {
      searchError.value = err?.message || "Failed to search profiles";
    } finally {
      isSearching.value = false;
    }
  });

  useVisibleTask$(({ track, cleanup }) => {
    const q = track(() => searchQuery.value).trim();
    const tab = track(() => activeTab.value);
    const limit = track(() => searchLimit.value);
    const offset = track(() => searchOffset.value);

    if (!q) {
      searchResults.value = null;
      searchError.value = "";
      isSearching.value = false;
      return;
    }

    let cancelled = false;
    isSearching.value = true;

    const timer = setTimeout(async () => {
      try {
        const res = await searchApprovedProfiles({ q, type: tab, limit, offset });
        if (!cancelled) {
          searchResults.value = res;
          searchError.value = "";
        }
      } catch (err: any) {
        if (!cancelled) {
          searchError.value = err?.message || "Failed to search profiles";
        }
      } finally {
        if (!cancelled) {
          isSearching.value = false;
        }
      }
    }, 200);

    cleanup(() => {
      cancelled = true;
      clearTimeout(timer);
    });
  });

  const handleTabChange = $((nextTab: "residential" | "commercial") => {
    activeTab.value = nextTab;
    searchOffset.value = 0;
  });

  const openCreateModal = $(() => {
    createFormData.value = { approved: true };
    activeModal.value = "create";
  });

  const openViewModal = $((profile: JobProfile) => {
    selectedProfile.value = profile;
    activeModal.value = "view";
  });

  const openEditModal = $((profile: JobProfile) => {
    selectedProfile.value = profile;
    editFormData.value = { ...profile };
    activeModal.value = "edit";
  });

  const openDeleteModal = $((profile: JobProfile) => {
    selectedProfile.value = profile;
    activeModal.value = "delete";
  });

  const closeModal = $(() => {
    activeModal.value = null;
    selectedProfile.value = null;
  });

  const handleCreateSubmit = $(async () => {
    const payload = {
      ...createFormData.value,
      approved: true,
    };
    const res = await createAction.submit(payload as any);
    return res;
  });

  const handleEditSubmit = $(async () => {
    if (!editFormData.value.id) return { status: 400, success: false };
    const res = await updateAction.submit(editFormData.value as any);
    return res;
  });

  const handleDeleteConfirm = $(async () => {
    if (!selectedProfile.value?.id) return;
    const res = await deleteAction.submit({ id: selectedProfile.value.id });
    if (res.status === 200 || res.value?.success) {
      closeModal();
      if (searchQuery.value.trim()) {
        await runSearch(searchQuery.value, activeTab.value, searchLimit.value, searchOffset.value);
      }
    }
  });

  // Default loader state (URL query pagination)
  const paginated = profilesSignal.value;
  const entries = paginated?.items || [];
  const totalCount = paginated?.totalCount ?? 0;
  const limit = paginated?.limit ?? 20;
  const offset = paginated?.offset ?? 0;

  const availableServices = servicesSignal.value || [];
  const isSearchActive = searchQuery.value.trim().length > 0;

  // 1. Filter default paginated entries by Commercial / Non-Commercial tab selection
  const tabFilteredEntries = entries.filter(({ profile }) => {
    if (activeTab.value === "commercial") {
      return Boolean(profile.is_commercial);
    }
    return !profile.is_commercial;
  });

  // 2. Choose search results when searching, otherwise tab-filtered loader items
  const searchItems = searchResults.value?.items ?? [];
  const displayedEntries = isSearchActive ? searchItems : tabFilteredEntries;

  // URL pagination helpers (default browse mode)
  const goToOffset = $((nextOffset: number) => {
    const safeOffset = Math.max(0, nextOffset);
    const params = new URLSearchParams(window.location.search);
    params.set("limit", String(limit));
    params.set("offset", String(safeOffset));
    nav(`?${params.toString()}`);
  });

  const hasPrev = offset > 0;
  const hasNext = offset + limit < totalCount;
  const showingStart = totalCount === 0 ? 0 : offset + 1;
  const showingEnd = Math.min(offset + entries.length, totalCount);

  // Search pagination helpers (independent of URL query params)
  const searchTotal = searchResults.value?.total_count ?? 0;
  const currentSearchLimit = searchLimit.value;
  const currentSearchOffset = searchOffset.value;
  const searchHasPrev = currentSearchOffset > 0;
  const searchHasNext = currentSearchOffset + currentSearchLimit < searchTotal;
  const searchStart = searchTotal === 0 ? 0 : currentSearchOffset + 1;
  const searchEnd = Math.min(currentSearchOffset + searchItems.length, searchTotal);

  return (
    <div class="space-y-6">
      {/* Centered Controls Container: Tabs & Search Bar */}
      <div class="flex flex-col items-center gap-4">
        {/* Commercial / Non-Commercial Tab Switcher: Fluid on mobile */}
        <div class="w-full sm:w-auto flex bg-slate-200/80 p-1 rounded-2xl sm:rounded-full text-xs font-bold text-gray-600">
          <button
            onClick$={() => handleTabChange("residential")}
            class={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full transition-all text-center ${
              activeTab.value === "residential"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
            }`}
          >
            Residential
          </button>
          <button
            onClick$={() => handleTabChange("commercial")}
            class={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full transition-all text-center ${
              activeTab.value === "commercial"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
            }`}
          >
            Commercial
          </button>
        </div>

        {/* Search Row Container with Create Button Positioned Far Right on Desktop, stacked/fluid on mobile */}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full relative">
          {/* Smooth Expand Search Bar */}
          <div class="relative flex items-center bg-slate-300/80 hover:bg-slate-300 rounded-full px-5 py-3.5 w-full sm:w-80 md:w-96 focus-within:sm:w-full max-w-lg transition-all duration-300 ease-in-out">
            <IconSearch class="w-5 h-5 text-gray-600 mr-3.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search job profiles"
              value={searchQuery.value}
              onInput$={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
                searchOffset.value = 0;
              }}
              class="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
            />
          </div>

          {/* Create Button Positioned Far Right on Desktop */}
          <button
            onClick$={openCreateModal}
            class="w-full sm:w-auto sm:absolute sm:right-0 bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>+ Create Profile</span>
          </button>
        </div>
      </div>

      {/* Grid Display Container: Flows naturally with page scroll */}
      <div class="w-full pb-4 space-y-3">
        {searchError.value ? (
          <div class="text-sm text-red-600 py-12 text-center bg-red-50/50 rounded-2xl border border-red-100">
            {searchError.value}
          </div>
        ) : isSearching.value ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            Searching job profiles...
          </div>
        ) : displayedEntries.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No job profiles found
          </div>
        ) : (
          displayedEntries.map(({ profile, days_since_last_job, has_no_jobs }) => (
            <JobCard
              key={profile.id}
              profile={profile}
              daysSinceLastJob={days_since_last_job}
              hasNoJobs={has_no_jobs}
              onView$={openViewModal}
              onEdit$={openEditModal}
              onDelete$={openDeleteModal}
            />
          ))
        )}
      </div>

      {/* Default Loader Pagination Controls */}
      {!isSearchActive && totalCount > 0 && (
        <div class="flex items-center justify-between pt-2 text-sm text-gray-600">
          <span>
            Showing {showingStart}–{showingEnd} of {totalCount}
          </span>
          <div class="flex items-center gap-2">
            <button
              disabled={!hasPrev}
              onClick$={() => goToOffset(offset - limit)}
              class="px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-gray-900 font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={!hasNext}
              onClick$={() => goToOffset(offset + limit)}
              class="px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-gray-900 font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Search Pagination Controls */}
      {isSearchActive && !isSearching.value && searchTotal > 0 && (
        <div class="flex items-center justify-between pt-2 text-sm text-gray-600">
          <span>
            Showing {searchStart}–{searchEnd} of {searchTotal} matching{" "}
            {searchTotal === 1 ? "profile" : "profiles"}
          </span>
          <div class="flex items-center gap-2">
            <button
              disabled={!searchHasPrev}
              onClick$={() => (searchOffset.value = Math.max(0, currentSearchOffset - currentSearchLimit))}
              class="px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-gray-900 font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={!searchHasNext}
              onClick$={() => (searchOffset.value = currentSearchOffset + currentSearchLimit)}
              class="px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-gray-900 font-medium disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal.value === "create" && (
        <CreateModal
          formData={createFormData}
          availableServices={availableServices}
          onClose$={closeModal}
          onSubmit$={handleCreateSubmit}
        />
      )}

      {activeModal.value === "view" && selectedProfile.value && (
        <ViewModal profile={selectedProfile.value} onClose$={closeModal} />
      )}

      {activeModal.value === "edit" && selectedProfile.value && (
        <EditModal
          formData={editFormData}
          availableServices={availableServices}
          onClose$={closeModal}
          onSubmit$={handleEditSubmit}
        />
      )}

      {activeModal.value === "delete" && selectedProfile.value && (
        <DeleteModal
          profile={selectedProfile.value}
          text="Delete Profile"
          onClose$={closeModal}
          onConfirm$={handleDeleteConfirm}
        />
      )}
    </div>
  );
});