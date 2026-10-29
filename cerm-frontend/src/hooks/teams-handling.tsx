import { globalAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";

const API_BASE = import.meta.env.PUBLIC_CERM_API_URL ?? "http://cerm-api:8080";

export interface Team {
  id: number;
  name: string;
  team_color: string | null;
  created_at: string;
  updated_at: string;
}

// Route Loader to fetch all teams
export const useTeams = routeLoader$(async ({ cookie, redirect }) => {
  const token = cookie.get("cerm_token");

  if (!token) {
    throw redirect(302, "/");
  }

  try {
    const res = await fetch(`${API_BASE}/api/teams`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) throw new Error("Failed to fetch teams");

    const teams: Team[] = await res.json();
    return teams;
  } catch {
    throw redirect(302, "/");
  }
});

// Action to create a team
export const useCreateTeam = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          name: data.name,
          team_color: data.team_color || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Failed to create team" });
      }

      return { success: true, team: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    name: z.string().min(1, "Team name is required"),
    team_color: z.string().optional().nullable(),
  })
);

// Action to update a team
export const useUpdateTeam = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/teams/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          name: data.name,
          team_color: data.team_color || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Failed to update team" });
      }

      return { success: true, team: json };
    } catch {
      return fail(500, { message: "Network error. Please try again." });
    }
  },
  zod$({
    id: z.coerce.number(),
    name: z.string().min(1, "Team name is required"),
    team_color: z.string().optional().nullable(),
  })
);

// Action to delete a team
export const useDeleteTeam = globalAction$(
  async (data, { fail, cookie }) => {
    const token = cookie.get("cerm_token");
    if (!token) return fail(401, { message: "Unauthorized" });

    try {
      const res = await fetch(`${API_BASE}/api/teams/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        return fail(res.status, { message: json.error ?? "Failed to delete team" });
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