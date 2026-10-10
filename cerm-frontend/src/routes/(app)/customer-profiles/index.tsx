import { component$, useSignal, $, useStore } from "@builder.io/qwik";
import { useApprovedProfiles, useUpdateCustomerProfile, useDeleteCustomerProfile } from "../../../hooks/customer-handling";
export { useApprovedProfiles, useUpdateCustomerProfile, useDeleteCustomerProfile  } from "../../../hooks/customer-handling"

export const CustomerProfileCard = component$((props: { profile: any; onRefresh$: any }) => {
  const { profile, onRefresh$ } = props;

  const isEditing = useSignal(false);
  const formData = useStore({ ...profile });
  const isProcessing = useSignal(false);

  const updateAction = useUpdateCustomerProfile();
  const deleteAction = useDeleteCustomerProfile();

  const handleSave$ = $(async () => {
    isProcessing.value = true;
    const result = await updateAction.submit({
      id: profile.id,
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      approved: formData.approved,
      is_commercial: formData.is_commercial,
      is_seen: formData.is_seen,
      admin_notes: formData.admin_notes,
      job_payout: formData.job_payout,
    });
    isProcessing.value = false;

    if (result?.value?.success) {
      isEditing.value = false;
      onRefresh$();
    } else {
      alert(result?.value?.message || "Failed to update profile");
    }
  });

  const handleDelete$ = $(async () => {
    if (!confirm("Are you sure you want to delete this customer profile?")) return;
    
    isProcessing.value = true;
    const result = await deleteAction.submit({ id: profile.id });
    isProcessing.value = false;

    if (result?.value?.success) {
      onRefresh$();
    } else {
      alert(result?.value?.message || "Failed to delete profile");
    }
  });

  const formattedTime = new Date(profile.created_at).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div class="bg-white shadow rounded-lg p-6 border border-gray-200 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              {isEditing.value ? (
                <input
                  type="text"
                  value={formData.name}
                  onInput$={(e) => (formData.name = (e.target as HTMLInputElement).value)}
                  class="border rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                profile.name
              )}
            </h3>
            <p class="text-sm text-gray-500">{formattedTime}</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        </div>

        {/* Details Grid */}
        <div class="space-y-2 text-sm text-gray-700 mb-4">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone_number}</p>
          <p><strong>Address:</strong> {profile.address}, {profile.city}, {profile.state} {profile.zip}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
        {isEditing.value ? (
          <>
            <button
              onClick$={() => (isEditing.value = false)}
              disabled={isProcessing.value}
              class="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick$={handleSave$}
              disabled={isProcessing.value}
              class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isProcessing.value ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick$={() => (isEditing.value = true)}
              class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Edit
            </button>
            <button
              onClick$={handleDelete$}
              disabled={isProcessing.value}
              class="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default component$(() => {
  // Use loader to fetch approved profiles server-side
  const profilesSignal = useApprovedProfiles();

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Approved Customer Profiles</h1>

      {profilesSignal.value.length === 0 ? (
        <p class="text-gray-500">No approved customer profiles found.</p>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profilesSignal.value.map((profile) => (
            <CustomerProfileCard
              key={profile.id}
              profile={profile}
              onRefresh$={$(() => {
                window.location.reload(); // Simple reload to re-trigger routeLoader
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
});