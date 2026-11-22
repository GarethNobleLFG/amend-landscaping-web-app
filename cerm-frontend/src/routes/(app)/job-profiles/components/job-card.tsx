import { component$, type PropFunction } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";
import { IconEye, IconPencil, IconTrash } from "../../../../components/ui/icons";

interface JobCardProps {
  profile: JobProfile;
  daysSinceLastJob?: number | null;
  hasNoJobs?: boolean;
  onView$: PropFunction<(profile: JobProfile) => void>;
  onEdit$: PropFunction<(profile: JobProfile) => void>;
  onDelete$: PropFunction<(profile: JobProfile) => void>;
}

export const JobCard = component$<JobCardProps>(
  ({ profile, daysSinceLastJob, hasNoJobs, onView$, onEdit$, onDelete$ }) => {
    const showNoJobsBadge = Boolean(hasNoJobs);
    const showDaysBadge =
      !showNoJobsBadge && typeof daysSinceLastJob === "number" && daysSinceLastJob >= 0;
    const dayLabel = daysSinceLastJob === 1 ? "1 day" : `${daysSinceLastJob} days`;

    return (
      <div class="flex items-center justify-between gap-3 p-3.5 bg-white hover:bg-slate-200/80 rounded-xl transition-all group">
        <div class="flex items-center gap-2.5 min-w-0 pr-2">
          <span class="font-semibold text-gray-900 text-sm truncate">{profile.name}</span>

          {showNoJobsBadge && (
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap flex-shrink-0">
              This profile has not had a job scheduled for it yet
            </span>
          )}

          {showDaysBadge && (
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap flex-shrink-0">
              {dayLabel} since last job, and no new job dates scheduled
            </span>
          )}
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick$={() => onView$(profile)}
            class="p-2 rounded-lg bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="View Profile"
          >
            <IconEye class="w-4 h-4" />
          </button>

          <button
            onClick$={() => onEdit$(profile)}
            class="p-2 rounded-lg bg-white text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all"
            title="Edit Profile"
          >
            <IconPencil class="w-4 h-4" />
          </button>

          <button
            onClick$={() => onDelete$(profile)}
            class="p-2 rounded-lg bg-white text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete Profile"
          >
            <IconTrash class="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);