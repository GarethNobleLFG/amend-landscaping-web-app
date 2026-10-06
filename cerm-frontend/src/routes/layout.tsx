import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <header class="p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 class="text-xl font-bold text-emerald-400">CERM App</h1>
      </header>
      <main class="flex-1 p-6">
        <Slot />
      </main>
      <footer class="p-4 border-t border-slate-800 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CERM Landscaping
      </footer>
    </div>
  );
});
