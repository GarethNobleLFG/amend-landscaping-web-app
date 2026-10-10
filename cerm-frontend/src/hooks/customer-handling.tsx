import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  services_requested: Record<string, any>;
  scheduled_date?: string | null;
  description?: string | null;
  approved: boolean;
  is_commercial: boolean;
  is_seen: boolean;
  referral_info?: string | null;
  schedule?: string | null;
  admin_notes?: string | null;
  job_payout?: number | null;
  created_at: string;
  updated_at: string;
}

export const useApprovedProfiles = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  try {
    const res = await fetch(`${API_BASE}/api/customer-profiles/approved`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Failed to fetch approved profiles");

    const profiles: CustomerProfile[] = await res.json();
    return profiles ?? [];
  } catch {
    throw redirect(302, "/");
  }
});

export const useUnapprovedProfiles = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  try {
    const res = await fetch(`${API_BASE}/api/customer-profiles/unapproved`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Failed to fetch unapproved profiles");

    const profiles: CustomerProfile[] = await res.json();
    return profiles ?? [];
  } catch {
    throw redirect(302, "/");
  }
});

export const useCreateCustomerProfile = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/customer-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Failed to create profile" });
      }

      return { success: true, profile: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
    services_requested: z.any().optional(),
    is_commercial: z.boolean().optional(),
    referral_info: z.string().optional(),
    schedule: z.string().optional(),
    description: z.string().optional(),
  })
);

export const useUpdateCustomerProfile = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    const { id, ...payload } = data;

    try {
      const res = await fetch(`${API_BASE}/api/customer-profiles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Failed to update profile" });
      }

      return { success: true, profile: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    id: z.coerce.number(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
    approved: z.boolean().optional(),
    is_commercial: z.boolean().optional(),
    is_seen: z.boolean().optional(),
    admin_notes: z.string().optional(),
    job_payout: z.coerce.number().optional(),
  })
);

export const useDeleteCustomerProfile = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/customer-profiles/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return fail(res.status, { message: json.error ?? "Failed to delete profile" });
      }

      return { success: true };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    id: z.coerce.number(),
  })
);