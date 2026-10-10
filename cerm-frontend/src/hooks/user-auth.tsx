import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export const useSignUp = globalAction$(
  async (data, { fail, cookie }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          creation_code: data.creationCode,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Sign up failed" });
      }

      cookie.set("cerm_token", json.token, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, 
      });

      return { success: true, user: json.user };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    creationCode: z.string().min(1, "Creation code is required"),
  })
);

export const useSignIn = globalAction$(
  async (data, { fail, cookie }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Sign in failed" });
      }

      cookie.set("cerm_token", json.token, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      });

      return { success: true, user: json.user };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
);

export const useAuthUser = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/"); 
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const user: AuthUser = await res.json();
    return user;
  } catch {
    cookie.delete("cerm_token", { path: "/" });
    throw redirect(302, "/");
  }
});