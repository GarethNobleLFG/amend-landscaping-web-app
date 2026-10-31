import { component$, useSignal, $ } from "@builder.io/qwik";
import { useUpdateJob } from "~/hooks/job-handling";
import { CardHeader } from "./card-header";
import { CardDetails } from "./card-details";
import { CompleteJobModal } from "./complete-job-modal";

export interface JobProfile {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  services_requested?: Record<string, boolean> | string | null;
  is_commercial?: boolean | null;
  description?: string | null;
  [key: string]: any;
}

export interface JobRecord {
  id?: number | string | null;
  job_profile_id?: number | null;
  team_id?: number | null;
  scheduled_day?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  completed?: boolean | null;
  notes?: string | null;
  completed_notes?: string | null;
  job_profile?: JobProfile | null;
  [key: string]: any;
}

export interface DailyJobsCardProps {
  job: JobRecord;
  isTeamLead?: boolean;
}

export const DailyJobsCard = component$<DailyJobsCardProps>(({ job, isTeamLead = false }) => {
  const isExpanded = useSignal(false);
  const copied = useSignal(false);
  const isSubmitting = useSignal(false);
  const isCompleteModalOpen = useSignal(false);

  const localStartTime = useSignal<string | null>(job.start_time ?? null);
  const localEndTime = useSignal<string | null>(job.end_time ?? null);
  const localCompleted = useSignal<boolean>(Boolean(job.completed));
  const localCompletedNotes = useSignal<string | null>(job.completed_notes ?? null);

  const updateJobAction = useUpdateJob();

  const profile = job.job_profile;
  const isCommercial = Boolean(profile?.is_commercial);
  const isCompleted = localCompleted.value;
  const isJobRunning = Boolean(localStartTime.value && !isCompleted);

  const getDurationString = (start?: string | null, end?: string | null) => {
    if (!start || !end) return null;
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    if (isNaN(diffMs) || diffMs < 0) return null;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const durationStr = getDurationString(localStartTime.value, localEndTime.value);

  const getFullAddress = (p?: JobProfile | null) => {
    if (!p) return "";
    return [p.address, p.city, p.state, p.zip]
      .filter((v): v is string => Boolean(v && typeof v === "string" && v.trim() !== ""))
      .join(", ");
  };

  const fullAddress = getFullAddress(profile);

  const copyAddress$ = $(async (e: Event) => {
    e.stopPropagation();
    if (!fullAddress) return;
    try {
      await navigator.clipboard.writeText(fullAddress);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  });

  const handleStartJob$ = $(async (e: Event) => {
    e.stopPropagation();
    if (!job.id || !job.job_profile_id || !job.scheduled_day || isSubmitting.value) return;

    const cleanDay = job.scheduled_day.split("T")[0];
    const nowIso = new Date().toISOString();

    isSubmitting.value = true;
    try {
      const res = await updateJobAction.submit({
        id: Number(job.id),
        job_profile_id: Number(job.job_profile_id),
        team_id: job.team_id ? Number(job.team_id) : null,
        scheduled_day: cleanDay,
        start_time: nowIso,
        end_time: localEndTime.value ?? null,
        completed: false,
        notes: job.notes ?? null,
      });

      if (res.status === 200 || res.value?.success) {
        localStartTime.value = nowIso;
      }
    } finally {
      isSubmitting.value = false;
    }
  });

  const handleOpenCompleteModal$ = $(async (e: Event) => {
    e.stopPropagation();
    isCompleteModalOpen.value = true;
  });

  const handleConfirmCompletion$ = $(async (notes: string) => {
    if (!job.id || !job.job_profile_id || !job.scheduled_day) return false;

    const cleanDay = job.scheduled_day.split("T")[0];
    const nowIso = new Date().toISOString();

    const res = await updateJobAction.submit({
      id: Number(job.id),
      job_profile_id: Number(job.job_profile_id),
      team_id: job.team_id ? Number(job.team_id) : null,
      scheduled_day: cleanDay,
      start_time: localStartTime.value ?? nowIso,
      end_time: nowIso,
      completed: true,
      notes: job.notes ?? null,
      completed_notes: notes || null,
    });

    const isOk = res.status === 200 || res.value?.success;
    if (isOk) {
      localEndTime.value = nowIso;
      localCompleted.value = true;
      localCompletedNotes.value = notes || null;
      return true;
    }
    return false;
  });

  const servicesObj =
    profile?.services_requested ||
    (profile as any)?.services ||
    (profile as any)?.requested_services ||
    {};

  const activeServices: string[] =
    typeof servicesObj === "object" && servicesObj !== null
      ? Object.entries(servicesObj).filter(([, v]) => Boolean(v)).map(([k]) => k)
      : typeof servicesObj === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(servicesObj);
            return typeof parsed === "object" && parsed !== null
              ? Object.entries(parsed).filter(([, v]) => Boolean(v)).map(([k]) => k)
              : [servicesObj];
          } catch {
            return [servicesObj];
          }
        })()
      : [];

  return (
    <>
      <div class={`w-full bg-white rounded-xl overflow-hidden border-0 shadow-none transition-opacity ${isCompleted ? "opacity-75" : ""}`}>
        <CardHeader
          title={profile?.name || "Unnamed Job"}
          isCompleted={isCompleted}
          isJobRunning={isJobRunning}
          durationStr={durationStr}
          fullAddress={fullAddress}
          isExpanded={isExpanded}
          copied={copied}
          isTeamLead={isTeamLead}
          hasStartTime={Boolean(localStartTime.value)}
          isSubmitting={isSubmitting}
          onCopyAddress$={copyAddress$}
          onStartJob$={handleStartJob$}
          onEndJob$={handleOpenCompleteModal$}
        />

        {isExpanded.value && (
          <CardDetails
            startTime={localStartTime.value}
            endTime={localEndTime.value}
            isCommercial={isCommercial}
            email={profile?.email}
            phoneNumber={profile?.phone_number}
            services={activeServices}
            jobNotes={job.notes}
            clientNotes={profile?.description}
          />
        )}
      </div>

      {/* Completion Modal */}
      {isCompleteModalOpen.value && (
        <CompleteJobModal
          jobTitle={profile?.name || "Unnamed Job"}
          onClose$={() => (isCompleteModalOpen.value = false)}
          onConfirm$={handleConfirmCompletion$}
        />
      )}
    </>
  );
});