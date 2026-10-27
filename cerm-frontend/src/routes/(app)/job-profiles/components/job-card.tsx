import { component$, type PropFunction } from "@builder.io/qwik";
import type { JobProfile } from "../../../../hooks/job-profile-handling";
import { IconEye, IconPencil, IconTrash } from "../../../../components/ui/icons";

interface JobCardProps {
  profile: JobProfile;
  onView$: PropFunction<(profile: JobProfile) => void>;
  onEdit$: PropFunction<(profile: JobProfile) => void>;
  onDelete$: PropFunction<(profile: JobProfile) => void>;
}

export const JobCard = component$<JobCardProps>(
  ({ profile, onView$, onEdit$, onDelete$ }) => {
    return (
      <div class="flex items-center justify-between p-3.5 bg-white hover:bg-slate-200/80 rounded-xl transition-all group">
        <span class="font-semibold text-gray-900 text-sm truncate pr-2">{profile.name}</span>

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