import { component$ } from "@builder.io/qwik";
import type { Job } from "~/hooks/job-handling";

interface ScheduleJobCardProps {
  job: Job;
  color?: string; // e.g. hex color, defaults to emerald-600 equivalent
  onClick$?: () => void;
}

// Helper to convert hex to rgba for background tinting
function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ScheduleJobCard = component$<ScheduleJobCardProps>(({
  job,
  color = "#059669", // Base emerald-600
  onClick$,
}) => {
  const customerName = job.job_profile?.name || `Profile #${job.job_profile_id}`;
  const bgTint = hexToRgba(color, 0.15);

  return (
    <div
      onClick$={onClick$}
      class="px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-xs font-semibold leading-tight rounded-md transition truncate cursor-pointer hover:opacity-90"
      style={{
        backgroundColor: bgTint,
        color: color,
      }}
      title={customerName}
    >
      <span class="block truncate">{customerName}</span>
    </div>
  );
});