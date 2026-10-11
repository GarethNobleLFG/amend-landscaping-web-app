import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  useApprovedProfiles,
  useUpdateCustomerProfile,
  useDeleteCustomerProfile,
  type CustomerProfile,
} from "../../../hooks/customer-handling";
import { CustomerCard } from "./components/customer-card";
import { ViewModal } from "./components/view-modal";
import { EditModal } from "./components/edit-modal";
import { DeleteModal } from "./components/delete-modal";

export { useApprovedProfiles, useUpdateCustomerProfile, useDeleteCustomerProfile };

// Search Icon Component
const IconSearch = component$((props: { class?: string }) => (
  <svg class={props.class || "w-5 h-5"} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
));

export default component$(() => {
  const profilesSignal = useApprovedProfiles();
  const updateAction = useUpdateCustomerProfile();
  const deleteAction = useDeleteCustomerProfile();

  const selectedProfile = useSignal<CustomerProfile | null>(null);
  const activeModal = useSignal<"view" | "edit" | "delete" | null>(null);
  const editFormData = useSignal<Partial<CustomerProfile>>({});

  // Tab state: 'residential' (non-commercial) vs 'commercial'
  const activeTab = useSignal<"residential" | "commercial">("residential");

  // Search query signal for prefix filtering
  const searchQuery = useSignal("");

  const openViewModal = $((profile: CustomerProfile) => {
    selectedProfile.value = profile;
    activeModal.value = "view";
  });

  const openEditModal = $((profile: CustomerProfile) => {
    selectedProfile.value = profile;
    editFormData.value = { ...profile };
    activeModal.value = "edit";
  });

  const openDeleteModal = $((profile: CustomerProfile) => {
    selectedProfile.value = profile;
    activeModal.value = "delete";
  });

  const closeModal = $(() => {
    activeModal.value = null;
    selectedProfile.value = null;
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
    }
  });

  const profiles = profilesSignal.value || [];
  const query = searchQuery.value.trim().toLowerCase();

  // 1. Filter profiles by Commercial / Non-Commercial tab selection
  const tabFilteredProfiles = profiles.filter((p) => {
    if (activeTab.value === "commercial") {
      return Boolean(p.is_commercial);
    }
    return !p.is_commercial;
  });

  // 2. Filter profiles by search query prefix (case-insensitive)
  const filteredProfiles = tabFilteredProfiles.filter((p) => {
    if (!query) return true;
    return (p.name || "").toLowerCase().startsWith(query);
  });

  return (
    <div class="space-y-6">
      {/* Centered Controls Container: Tabs & Search Bar */}
      <div class="flex flex-col items-center gap-4">
        {/* Commercial / Non-Commercial Tab Switcher */}
        <div class="inline-flex bg-slate-200/80 p-1 rounded-full text-xs font-bold text-gray-600">
          <button
            onClick$={() => (activeTab.value = "residential")}
            class={`px-5 py-2 rounded-full transition-all ${activeTab.value === "residential"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
              }`}
          >
            Residential
          </button>
          <button
            onClick$={() => (activeTab.value = "commercial")}
            class={`px-5 py-2 rounded-full transition-all ${activeTab.value === "commercial"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
              }`}
          >
            Commercial
          </button>
        </div>

        {/* Smooth Expand Search Bar */}
        <div class="relative flex items-center bg-slate-300/80 hover:bg-slate-300 rounded-full px-5 py-3.5 w-80 focus-within:w-full max-w-lg transition-all duration-300 ease-in-out">
          <IconSearch class="w-5 h-5 text-gray-600 mr-3.5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search customer profiles"
            value={searchQuery.value}
            onInput$={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
            class="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Invisible Scrollable Container */}
      <div class="max-h-[600px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
        {filteredProfiles.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No customer profiles found
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <CustomerCard
              key={profile.id}
              profile={profile}
              onView$={openViewModal}
              onEdit$={openEditModal}
              onDelete$={openDeleteModal}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {activeModal.value === "view" && selectedProfile.value && (
        <ViewModal profile={selectedProfile.value} onClose$={closeModal} />
      )}

      {activeModal.value === "edit" && selectedProfile.value && (
        <EditModal formData={editFormData} onClose$={closeModal} onSubmit$={handleEditSubmit} />
      )}

      {activeModal.value === "delete" && selectedProfile.value && (
        <DeleteModal
          profile={selectedProfile.value}
          onClose$={closeModal}
          onConfirm$={handleDeleteConfirm}
        />
      )}
    </div>
  );
});