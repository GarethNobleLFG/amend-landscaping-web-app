import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface Service {
  id: number;
  name: string;
  description: string;
}

export const useAmendServices = routeLoader$(async ({ cookie }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    return []; 
  }

  try {
    const res = await fetch(`${API_BASE}/api/amend/services`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) {
      console.error("Amend API returned error status:", res.status);
      return []; 
    }

    const services: Service[] = await res.json();
    return services;
  } catch (err) {
    console.error("Network error fetching services:", err);
    return [];
  }
});