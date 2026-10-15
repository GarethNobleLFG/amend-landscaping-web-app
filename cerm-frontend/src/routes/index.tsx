import { component$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city"; 
import { useSignIn, useSignUp } from "~/hooks/user-auth";

export { useSignIn, useSignUp };

export default component$(() => {
  const isSignUp = useSignal(false);
  const email = useSignal("");
  const fullName = useSignal("");
  const creationCode = useSignal("");

  const pw = useStore({
    password: "",
    confirm: "",
    mismatch: false,
  });

  const signIn = useSignIn();
  const signUp = useSignUp();
  const nav = useNavigate();

  const activeError = isSignUp.value
    ? (signUp.value as any)?.message
    : (signIn.value as any)?.message;

  return (
    <div class="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 text-gray-900 font-sans">

      {/* LEFT SIDE: Brand Panel */}
      <div class="w-full md:w-1/2 bg-gradient-to-br from-green-50/90 via-white to-green-100/50 p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200/80">
        <div class="flex items-center justify-center md:justify-start gap-3.5 w-full">
          <img
            src="/logo.webp"
            alt="Amend Logo"
            class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
            onError$={(e) => {
              (e.target as HTMLImageElement).src = "/logo.png";
            }}
          />
          <span class="font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-gray-900">
            CERM <span class="text-green-600">by Amend</span>
          </span>
        </div>

        <div class="my-auto py-10 md:py-12 flex flex-col items-center justify-center text-center w-full">
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-tight">
            Keep <span class="text-green-600">track of it all.</span>
          </h1>
        </div>

        <div class="text-xs text-gray-400 font-semibold pt-4 text-center md:text-left w-full">
          © {new Date().getFullYear()} Amend Landscaping LLC. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login / Sign Up Form */}
      <div class="w-full md:w-1/2 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center text-center">
        <div class="w-full hidden md:block" />

        <div class="my-auto w-full max-w-md flex flex-col items-center px-2 sm:px-6 py-6 md:py-0">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            {isSignUp.value ? "Create your CERM account" : "Log into CERM"}
          </h2>

          {activeError && (
            <div class="w-full mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-left">
              {activeError}
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isSignUp.value && (
            <form
              preventdefault:submit
              onSubmit$={async () => {
                const res = await signIn.submit({
                  email: email.value,
                  password: pw.password,
                });

                if (res?.value?.success || res?.value?.user) {
                  const role = res.value.user?.role;
                  if (role === "ADMIN") {
                    await nav("/dashboard");
                  } else if (role === "EMPLOYEE") {
                    await nav("/job-schedule");
                  }
                }
              }}
              class="w-full space-y-4"
            >
              <input
                type="email"
                name="email"
                required
                value={email.value}
                onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
                placeholder="Email address"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <input
                type="password"
                name="password"
                required
                value={pw.password}
                onInput$={(e) => { pw.password = (e.target as HTMLInputElement).value; }}
                placeholder="Password"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <a href="#" class="block text-xs font-semibold text-gray-500 hover:text-green-700 transition-colors mt-2">
                Forgot password?
              </a>
              <button
                type="submit"
                class="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-base shadow-md shadow-green-600/20 active:scale-[0.98] transition-all cursor-pointer mt-1"
              >
                Log In
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {isSignUp.value && (
            <form
              preventdefault:submit
              onSubmit$={async () => {
                if (pw.mismatch) return;
                const res = await signUp.submit({
                  name: fullName.value,
                  email: email.value,
                  password: pw.password,
                  creationCode: creationCode.value,
                });

                if (res?.value?.success || res?.value?.user) {
                  const role = res.value.user?.role;
                  if (role === "ADMIN") {
                    await nav("/dashboard");
                  } else if (role === "EMPLOYEE") {
                    await nav("/job-schedule");
                  }
                }
              }}
              class="w-full space-y-4"
            >
              <input
                type="text"
                name="name"
                required
                value={fullName.value}
                onInput$={(e) => (fullName.value = (e.target as HTMLInputElement).value)}
                placeholder="Full Name"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <input
                type="email"
                name="email"
                required
                value={email.value}
                onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
                placeholder="Email address"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <input
                type="password"
                name="password"
                required
                value={pw.password}
                onInput$={(e) => {
                  pw.password = (e.target as HTMLInputElement).value;
                  pw.mismatch = pw.confirm.length > 0 && pw.password !== pw.confirm;
                }}
                placeholder="Password"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <div>
                <input
                  type="password"
                  required
                  value={pw.confirm}
                  onInput$={(e) => {
                    pw.confirm = (e.target as HTMLInputElement).value;
                    pw.mismatch = pw.confirm.length > 0 && pw.password !== pw.confirm;
                  }}
                  placeholder="Confirm Password"
                  class={`w-full px-5 py-4 bg-slate-100 border text-sm rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${pw.mismatch ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-green-600"}`}
                />
                {pw.mismatch && (
                  <p class="text-xs text-red-500 font-semibold mt-1.5 text-left pl-1">
                    Passwords do not match
                  </p>
                )}
              </div>
              <input
                type="text"
                name="creationCode"
                required
                value={creationCode.value}
                onInput$={(e) => (creationCode.value = (e.target as HTMLInputElement).value)}
                placeholder="Access Code"
                class="w-full px-5 py-4 bg-slate-100 border border-slate-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={pw.mismatch}
                class="w-full py-4 px-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-full text-base shadow-md shadow-green-600/20 active:scale-[0.98] transition-all cursor-pointer mt-1"
              >
                Create Account
              </button>
            </form>
          )}

          <div class="w-full border-t border-slate-100 my-6 sm:my-8" />

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