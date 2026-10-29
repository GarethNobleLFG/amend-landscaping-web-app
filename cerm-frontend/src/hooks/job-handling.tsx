import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface JobProfile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  services_requested: string;
  scheduled_date: string;
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

export interface Job {
  id: number;
  job_profile_id: number;
  team_id?: number | null;
  scheduled_day: string;
  notes?: string | null;
  job_profile?: JobProfile | null;
}

export const useJobs = routeLoader$<Job[]>(async ({ cookie, redirect }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  try {
    const res = await fetch(`${API_BASE}/api/jobs/admin`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Failed to fetch jobs");

    const json = await res.json();
    const jobs: Job[] = json.data ?? json;
    return jobs ?? [];
  } catch {
    throw redirect(302, "/");
  }
});

export const useJobsByMonth = routeLoader$<Job[]>(async ({ cookie, redirect, url }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  const month = url.searchParams.get("month") ?? new Date().getMonth() + 1;
  const year = url.searchParams.get("year") ?? new Date().getFullYear();

  try {
    const res = await fetch(`${API_BASE}/api/jobs/admin/month?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res.status === 404) {
      return [];
    }

    if (!res.ok) throw new Error("Failed to fetch jobs by month");

    const json = await res.json();
    
    const jobs = json.data ?? json;
    if (!Array.isArray(jobs)) {
      return [];
    }

    return jobs;
  } catch (err) {
    console.error("Error fetching monthly jobs:", err);
    return []; 
  }
});

export const useJobsByWeekAndTeam = routeLoader$<Job[]>(async ({ cookie, redirect, url }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!start || !end) {
    return [];
  }

  try {
    const res = await fetch(`${API_BASE}/api/jobs/team/week?start=${start}&end=${end}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res.status === 404) {
      return [];
    }

    if (!res.ok) throw new Error("Failed to fetch weekly team jobs");

    const json = await res.json();
    const jobs = json.data ?? json;
    if (!Array.isArray(jobs)) {
      return [];
    }

    return jobs;
  } catch (err) {
    console.error("Error fetching weekly team jobs:", err);
    return [];
  }
});

export const useJobById = routeLoader$<Job | null>(async ({ cookie, redirect, params }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  const id = params.id;
  if (!id) return null;

  try {
    const res = await fetch(`${API_BASE}/api/jobs/admin/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Failed to fetch job by ID");

    const json = await res.json();
    const job: Job = json.data ?? json;
    return job ?? null;
  } catch {
    throw redirect(302, "/");
  }
});

export const useCreateJob = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/jobs/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? json.message ?? "Failed to create job" });
      }

      return { success: true, job: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    job_profile_id: z.coerce.number().min(1, "Job profile ID is required"),
    team_id: z.coerce.number().optional().nullable(),
    scheduled_day: z.string().min(1, "Scheduled day is required"),
    notes: z.string().optional().nullable(),
  })
);

export const useUpdateJob = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    const { id, ...payload } = data;

    try {
      const res = await fetch(`${API_BASE}/api/jobs/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? json.message ?? "Failed to update job" });
      }

      return { success: true, job: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    id: z.coerce.number(),
    job_profile_id: z.coerce.number().min(1, "Job profile ID is required"),
    team_id: z.coerce.number().optional().nullable(),
    scheduled_day: z.string().min(1, "Scheduled day is required"),
    notes: z.string().optional().nullable(),
  })
);

export const useDeleteJob = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/jobs/admin/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return fail(res.status, { message: json.error ?? json.message ?? "Failed to delete job" });
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