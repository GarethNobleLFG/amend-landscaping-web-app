import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const isSignUp = useSignal(false);
  const email = useSignal("");
  const password = useSignal("");
  const fullName = useSignal("");
  const company = useSignal("");
  const nav = useNavigate();

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    // Redirect to main admin dashboard
    nav("/dashboard");
  });

  return (
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 text-gray-900 font-sans">

      {/* LEFT SIDE: Brand Panel (Centered on Mobile, Left-aligned on Desktop) */}
      <div class="w-full md:w-1/2 bg-gradient-to-br from-green-50/90 via-white to-green-100/50 p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200/80">

        {/* Top Logo & Title (Slightly Smaller) */}
        <div class="flex items-center justify-center md:justify-start gap-3.5 w-full">
          <img
            src="/logo.webp"
            alt="Amend Logo"
            class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = "/logo.wepg";
            }}
          />
          <span class="font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-gray-900">
            CERM <span class="text-green-600">by Amend</span>
          </span>
        </div>

        {/* Center Headline */}
        <div class="my-auto py-10 md:py-12 flex flex-col items-center justify-center text-center w-full">
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            Keep <span class="text-green-600">track of it all.</span>
          </h1>
        </div>

        {/* Bottom Copyright Text (Centered on mobile, left on desktop) */}
        <div class="text-xs text-gray-400 font-semibold pt-4 text-center md:text-left w-full">
          © {new Date().getFullYear()} Amend Landscaping LLC. All rights reserved.
        </div>

      </div>

      {/* RIGHT SIDE: 50% Evenly Spaced Login Form */}
      <div class="w-full md:w-1/2 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center text-center">

        <div class="w-full hidden md:block" />

        {/* Centered Form Block */}
        <div class="my-auto w-full max-w-md flex flex-col items-center px-2 sm:px-6 py-6 md:py-0">

          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            {isSignUp.value ? "Create your CERM account" : "Log into CERM"}
          </h2>

          <form onSubmit$={handleSubmit} class="w-full space-y-4">
            {isSignUp.value && (
              <>
                <input
                  type="text"
                  required
                  value={fullName.value}
                  onInput$={(e) => (fullName.value = (e.target as HTMLInputElement).value)}
                  placeholder="Full Name"
                  class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
                <input
                  type="text"
                  required
                  value={company.value}
                  onInput$={(e) => (company.value = (e.target as HTMLInputElement).value)}
                  placeholder="Company Name"
                  class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </>
            )}

            <input
              type="email"
              required
              value={email.value}
              onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
              placeholder="Email, username or phone"
              class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
            />

            <input
              type="password"
              required
              value={password.value}
              onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
              placeholder="Password"
              class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
            />

            <button
              type="submit"
              class="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-base shadow-md shadow-green-600/20 active:scale-[0.98] transition-all cursor-pointer mt-3"
            >
              {isSignUp.value ? "Sign Up" : "Log In"}
            </button>
          </form>

          {!isSignUp.value && (
            <div class="pt-5">
              <a href="#" class="text-xs font-semibold text-gray-600 hover:text-green-700 transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          {/* Divider */}
          <div class="w-full border-t border-slate-100 my-6 sm:my-8" />

          {/* Toggle Button */}
          {isSignUp.value ? (
            <button
              onClick$={() => (isSignUp.value = false)}
              class="w-full py-3.5 rounded-full border-2 border-green-600 text-green-700 font-bold text-sm hover:bg-green-50 transition-all cursor-pointer"
            >
              Log into existing account
            </button>
          ) : (
            <button
              onClick$={() => (isSignUp.value = true)}
              class="w-full py-3.5 rounded-full border-2 border-green-600 text-green-700 font-bold text-sm hover:bg-green-50 transition-all cursor-pointer"
            >
              Create new account
            </button>
          )}

        </div>

        {/* Bottom Amend Footer */}
        <div class="pt-6 sm:pt-8 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5 w-full">
          <span class="text-green-600 font-extrabold">Amend Landscaping</span>
        </div>

      </div>

    </div>
  );
});

export const head: DocumentHead = {
  title: "Log In | CERM by Amend",
  meta: [
    {
      name: "description",
      content: "Log into CERM by Amend Landscaping.",
    },
  ],
};
