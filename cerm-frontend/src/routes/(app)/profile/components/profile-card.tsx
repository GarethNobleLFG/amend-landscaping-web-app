import { component$, useSignal, $ } from "@builder.io/qwik";
import type { AuthUser } from "~/hooks/user-auth";
import type { Team } from "~/hooks/teams-handling";
import { IconEdit } from "../../../../components/ui/icons";

interface ProfileCardProps {
  user: AuthUser;
  teams: Team[];
  updateAction: any;
}

export const ProfileCard = component$(({ user, teams, updateAction }: ProfileCardProps) => {
  // Field-level edit toggle signals
  const isEditingName = useSignal(false);
  const isEditingEmail = useSignal(false);
  const isEditingPassword = useSignal(false);

  // Form input signals initialized with user profile values
  const name = useSignal(user.name);
  const email = useSignal(user.email);
  const password = useSignal("");
  const confirmPassword = useSignal("");

  // Status feedback signals
  const isSubmitting = useSignal(false);
  const successMessage = useSignal("");
  const errorMessage = useSignal("");

  // Resolve assigned team name from loaded teams
  const userTeam = teams.find((t) => t.id === user.team_id);
  const teamName = userTeam ? userTeam.name : "No Team";

  const isAdmin = user.role === "ADMIN";
  const isLead = user.role === "TEAM LEAD";

  const handleSubmit = $(async (e: SubmitEvent) => {
    e.preventDefault();
    successMessage.value = "";
    errorMessage.value = "";

    // Validate password confirmation when changing password
    if (isEditingPassword.value) {
      if (!password.value || password.value.length < 8) {
        errorMessage.value = "Password must be at least 8 characters.";
        return;
      }
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
      }
    }

    isSubmitting.value = true;

    try {
      const payload: { name: string; email: string; password?: string } = {
        name: name.value,
        email: email.value,
      };

      if (isEditingPassword.value && password.value.trim() !== "") {
        payload.password = password.value;
      }

      const res = await updateAction.submit(payload);

      if (res?.status === 200 || res?.value?.success) {
        successMessage.value = "Profile updated successfully!";
        
        // Reset edit toggles and clear sensitive inputs
        isEditingName.value = false;
        isEditingEmail.value = false;
        isEditingPassword.value = false;
        password.value = "";
        confirmPassword.value = "";

        setTimeout(() => {
          successMessage.value = "";
        }, 3000);
      } else {
        errorMessage.value = res?.value?.message || "Failed to update profile.";
      }
    } catch {
      errorMessage.value = "Network error. Please try again.";
    } finally {
      isSubmitting.value = false;
    }
  });

  const isAnyEditing =
    isEditingName.value || isEditingEmail.value || isEditingPassword.value;

  return (
    <div class="bg-white rounded-3xl p-4 sm:p-6 border-none shadow-none space-y-6">
      {/* Top Header Row: Stacks vertically on mobile, side-by-side on sm+ screens */}
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-6 border-b border-slate-100">
        <div class="flex items-center gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 truncate">{user.name}</h2>
              <span
                class={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700"
                    : isLead
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>
        </div>

        {/* Team Name Badge */}
        <div class="self-start sm:self-auto">
          <span class="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200/80 rounded-full text-xs font-extrabold tracking-wide inline-block">
            {teamName}
          </span>
        </div>
      </div>

      {/* Feedback Alerts */}
      {successMessage.value && (
        <div class="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl">
          {successMessage.value}
        </div>
      )}

      {errorMessage.value && (
        <div class="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {errorMessage.value}
        </div>
      )}

      {/* Interactive Account Settings Form */}
      <form onSubmit$={handleSubmit} class="space-y-4 pt-2">
        {/* Name Field */}
        <div class="flex flex-col gap-2 p-3.5 bg-slate-50/50 rounded-2xl">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <button
              type="button"
              onClick$={() => {
                isEditingName.value = !isEditingName.value;
                if (!isEditingName.value) name.value = user.name;
              }}
              class={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isEditingName.value
                  ? "bg-slate-200 text-slate-800"
                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
              title={isEditingName.value ? "Cancel Editing" : "Edit Name"}
            >
              <IconEdit />
            </button>
          </div>

          {isEditingName.value ? (
            <input
              type="text"
              value={name.value}
              onInput$={(e) =>
                (name.value = (e.target as HTMLInputElement).value)
              }
              required
              class="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <span class="text-xs font-bold text-gray-800 break-words">{user.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div class="flex flex-col gap-2 p-3.5 bg-slate-50/50 rounded-2xl">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <button
              type="button"
              onClick$={() => {
                isEditingEmail.value = !isEditingEmail.value;
                if (!isEditingEmail.value) email.value = user.email;
              }}
              class={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isEditingEmail.value
                  ? "bg-slate-200 text-slate-800"
                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
              title={isEditingEmail.value ? "Cancel Editing" : "Edit Email"}
            >
              <IconEdit />
            </button>
          </div>

          {isEditingEmail.value ? (
            <input
              type="email"
              value={email.value}
              onInput$={(e) =>
                (email.value = (e.target as HTMLInputElement).value)
              }
              required
              class="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <span class="text-xs font-bold text-gray-800 break-words">{user.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div class="flex flex-col gap-2 p-3.5 bg-slate-50/50 rounded-2xl">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Password
            </label>
            <button
              type="button"
              onClick$={() => {
                isEditingPassword.value = !isEditingPassword.value;
                if (!isEditingPassword.value) {
                  password.value = "";
                  confirmPassword.value = "";
                }
              }}
              class={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isEditingPassword.value
                  ? "bg-slate-200 text-slate-800"
                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
              title={isEditingPassword.value ? "Cancel Editing" : "Change Password"}
            >
              <IconEdit />
            </button>
          </div>

          {isEditingPassword.value ? (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password.value}
                  onInput$={(e) =>
                    (password.value = (e.target as HTMLInputElement).value)
                  }
                  placeholder="Minimum 8 characters"
                  required
                  class="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword.value}
                  onInput$={(e) =>
                    (confirmPassword.value = (
                      e.target as HTMLInputElement
                    ).value)
                  }
                  placeholder="Re-enter new password"
                  required
                  class="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          ) : (
            <span class="text-xs font-bold text-gray-800">••••••••</span>
          )}
        </div>

        {/* Save Changes Button */}
        {isAnyEditing && (
          <div class="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting.value}
              class="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer border border-gray-200 flex items-center justify-center"
            >
              {isSubmitting.value ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
});