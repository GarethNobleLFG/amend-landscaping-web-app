import { globalAction$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export const useSignUp = globalAction$(
  async (data, { fail }) => {
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

      return { success: true, token: json.token, user: json.user as AuthUser };
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
  async (data, { fail }) => {
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

      return { success: true, token: json.token, user: json.user as AuthUser };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
);
