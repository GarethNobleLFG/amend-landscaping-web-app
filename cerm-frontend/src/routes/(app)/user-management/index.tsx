import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { useUsers, type AuthUser } from "~/hooks/user-auth";

export { useUsers };

export default component$(() => {
  const usersSignal = useUsers();
  const users = usersSignal.value || [];

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p class="text-sm text-gray-500 mt-0.5">View and manage system users and their assigned roles.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
            {users.length} {users.length === 1 ? "User" : "Users"} Total
          </span>
        </div>
      </div>

      {/* Users Table Card */}
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th class="py-4 px-6">Name</th>
                <th class="py-4 px-6">Email</th>
                <th class="py-4 px-6">Role</th>
                <th class="py-4 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              {users.length > 0 ? (
                users.map((user: AuthUser) => {
                  const isAdmin = user.role === "ADMIN";
                  const isLead = user.role === "LEAD";

                  return (
                    <tr key={user.id} class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-4 px-6 font-semibold text-gray-900">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-xl bg-green-100 text-green-700 font-bold flex items-center justify-center text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td class="py-4 px-6 text-gray-600">{user.email}</td>
                      <td class="py-4 px-6">
                        <span
                          class={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${
                            isAdmin
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : isLead
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-gray-500 text-xs">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} class="py-12 text-center text-gray-400 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "User Management - CERM by Amend",
  meta: [
    {
      name: "description",
      content: "Manage system users and roles",
    },
  ],
};