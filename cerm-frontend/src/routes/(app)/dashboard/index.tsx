import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="space-y-6">
      {/* Header section */}
      <div class="p-8 bg-white rounded-2xl">
        <h2 class="text-2xl font-bold text-gray-900">Company Dashboard</h2>
        <p class="text-gray-600 text-sm mt-1">
          Welcome back! Here is an overview of your landscaping operations and metrics.
        </p>
      </div>

      {/* Quick stats grid placeholder */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 bg-white rounded-2xl">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Jobs</p>
          <p class="text-3xl font-black text-gray-900 mt-2">12</p>
        </div>
        <div class="p-6 bg-white rounded-2xl">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Requests</p>
          <p class="text-3xl font-black text-green-600 mt-2">5</p>
        </div>
        <div class="p-6 bg-white rounded-2xl">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed Today</p>
          <p class="text-3xl font-black text-gray-900 mt-2">4</p>
        </div>
      </div>
    </div>
  );
});