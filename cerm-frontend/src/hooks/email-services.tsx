import { routeAction$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface JobProfile {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  services_requested?: Record<string, boolean> | string;
  scheduled_date?: string;
  description?: string;
  approved?: boolean;
  is_commercial?: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobActionFormInput {
  jobProfile: JobProfile;
  customMessage: string;
}

// Route action for approving a job
export const useApproveJob = routeAction$(async (data) => {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_profile: data.jobProfile,
        custom_message: data.customMessage,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("CERM API returned error status:", res.status, errorData);
      return { success: false, error: errorData.error || "Failed to approve job" };
    }

    const result = await res.json();
    return { success: true, message: result.message || "Approval email sent successfully!" };
  } catch (err) {
    console.error("Network error sending approval email:", err);
    return { success: false, error: "Network error communicating with API" };
  }
});

// Route action for denying a job
export const useDenyJob = routeAction$(async (data) => {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/deny`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_profile: data.jobProfile,
        custom_message: data.customMessage,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("CERM API returned error status:", res.status, errorData);
      return { success: false, error: errorData.error || "Failed to deny job" };
    }

    const result = await res.json();
    return { success: true, message: result.message || "Denial email sent successfully!" };
  } catch (err) {
    console.error("Network error sending denial email:", err);
    return { success: false, error: "Network error communicating with API" };
  }
});