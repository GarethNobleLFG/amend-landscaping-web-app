import { component$ } from "@builder.io/qwik";
import { getActiveServiceNames } from "~/utils/service-utils";

export interface ServicesListProps {
  services: any;
  title?: string;
  emptyText?: string;
  titleClass?: string;
}

export const ServicesList = component$<ServicesListProps>(({
  services,
  title = "Requested Services",
  emptyText = "No services selected",
  titleClass = "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2",
}) => {
  const activeServices = getActiveServiceNames(services);

  return (
    <div>
      <h4 class={titleClass}>
        {title}
      </h4>
      <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-sm">
        {activeServices.length > 0 ? (
          <ul class="space-y-2">
            {activeServices.map((service, idx) => (
              <li key={idx} class="flex items-center gap-2.5 text-gray-900 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                <span class="break-words">{service}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span class="text-gray-500 italic">{emptyText}</span>
        )}
      </div>
    </div>
  );
});