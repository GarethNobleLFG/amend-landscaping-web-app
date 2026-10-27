import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  useUnapprovedProfiles,
  useUpdateJobProfile,
  useDeleteJobProfile,
  type JobProfile,
} from "../../../hooks/job-profile-handling";
import { useAmendServices } from "../../../hooks/amend-api-handling";
import { useApproveJob, useDenyJob } from "../../../hooks/email-services";
import { IntakeCard } from "./components/intake-card";
import { DescriptionModal } from "./components/description-modal";
import { ApproveModal } from "./components/approve-modal";
import { DeleteModal } from "../../../components/ui/delete-modal";

export { useUpdateJobProfile, useDeleteJobProfile, useAmendServices, useApproveJob, useDenyJob };

export default component$(() => {
  const profilesSignal = useUnapprovedProfiles();
  const servicesSignal = useAmendServices();
  const updateAction = useUpdateJobProfile();
  const deleteAction = useDeleteJobProfile();
  const approveEmailAction = useApproveJob();
  const denyEmailAction = useDenyJob();

  const selectedProfile = useSignal<JobProfile | null>(null);
  const activeModal = useSignal<"approve" | "deny" | null>(null);
  const editFormData = useSignal<Partial<JobProfile>>({});
  const customMessage = useSignal("");

  const isDescModalOpen = useSignal(false);
  const selectedDescription = useSignal({ text: "", title: "" });

  const activeTab = useSignal<"residential" | "commercial">("residential");

  const openApproveModal = $((profile: JobProfile) => {
    selectedProfile.value = profile;
    editFormData.value = {
      ...profile,
      approved: true,
      is_seen: true,
    };
    customMessage.value = "";
    activeModal.value = "approve";
  });

  const openDenyModal = $((profile: JobProfile) => {
    selectedProfile.value = profile;
    customMessage.value = "";
    activeModal.value = "deny";
  });

  const openDescriptionModal = $((text: string, name?: string) => {
    selectedDescription.value = {
      text,
      title: name ? `Description: ${name}` : "Full Description",
    };
    isDescModalOpen.value = true;
  });

  const closeModal = $(() => {
    activeModal.value = null;
    selectedProfile.value = null;
    customMessage.value = "";
  });

  const handleApproveSubmit = $(async () => {
    if (!editFormData.value.id) return { status: 400, success: false };

    // 1. Update the job profile in the DB
    const res = await updateAction.submit(editFormData.value as any);
    if (res.status !== 200 && !res.value?.success) {
      return res;
    }

    // 2. Trigger the approval email
    await approveEmailAction.submit({
      jobProfile: editFormData.value as JobProfile,
      customMessage: customMessage.value,
    });

    return res;
  });

  const handleDenyConfirm = $(async () => {
    if (!selectedProfile.value?.id) return;

    // 1. Trigger the denial email
    await denyEmailAction.submit({
      jobProfile: selectedProfile.value,
      customMessage: customMessage.value,
    });

    // 2. Delete the profile
    const res = await deleteAction.submit({ id: selectedProfile.value.id });
    if (res.status === 200 || res.value?.success) {
      closeModal();
    }
  });

  const profiles = profilesSignal.value || [];
  const availableServices = servicesSignal.value || [];

  const residentialProfiles = profiles.filter((p) => !p.is_commercial);
  const commercialProfiles = profiles.filter((p) => Boolean(p.is_commercial));

  const displayedProfiles =
    activeTab.value === "commercial" ? commercialProfiles : residentialProfiles;

  return (
    <div class="space-y-6">
      {/* Tab Switcher: Fluid width on mobile, inline-flex on larger screens */}
      <div class="flex flex-col items-center gap-4">
        <div class="w-full sm:w-auto flex bg-slate-200/80 p-1 rounded-2xl sm:rounded-full text-xs font-bold text-gray-600">
          <button
            onClick$={() => (activeTab.value = "residential")}
            class={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab.value === "residential"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
            }`}
          >
            Residential
            {residentialProfiles.length > 0 && (
              <span class="inline-flex items-center justify-center bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] animate-pulse">
                {residentialProfiles.length}
              </span>
            )}
          </button>

          <button
            onClick$={() => (activeTab.value = "commercial")}
            class={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab.value === "commercial"
                ? "bg-white text-gray-900 shadow-sm"
                : "hover:text-gray-900"
            }`}
          >
            Commercial
            {commercialProfiles.length > 0 && (
              <span class="inline-flex items-center justify-center bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] animate-pulse">
                {commercialProfiles.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid Display: Removed hardcoded max-h so mobile flows with the page scrollbar naturally */}
      <div class="w-full pb-4">
        {displayedProfiles.length === 0 ? (
          <div class="text-sm text-gray-500 italic py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
            No unapproved intake profiles found
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProfiles.map((profile) => (
              <IntakeCard
                key={profile.id}
                profile={profile}
                onApprove$={openApproveModal}
                onDeny$={openDenyModal}
                onViewDescription$={openDescriptionModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Description Viewer Modal */}
      {isDescModalOpen.value && (
        <DescriptionModal
          title={selectedDescription.value.title}
          description={selectedDescription.value.text}
          onClose$={() => (isDescModalOpen.value = false)}
        />
      )}

      {/* Exclusive Modals */}
      {activeModal.value === "approve" && selectedProfile.value && (
        <ApproveModal
          formData={editFormData}
          customMessage={customMessage}
          availableServices={availableServices}
          onClose$={closeModal}
          onSubmit$={handleApproveSubmit}
        />
      )}

      {activeModal.value === "deny" && selectedProfile.value && (
        <DeleteModal
          profile={selectedProfile.value}
          customMessage={customMessage}
          text="Deny & Delete Intake Request"
          onClose$={closeModal}
          onConfirm$={handleDenyConfirm}
        />
      )}
    </div>
  );
});