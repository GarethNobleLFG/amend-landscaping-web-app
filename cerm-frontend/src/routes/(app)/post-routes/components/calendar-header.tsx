import { component$ } from "@builder.io/qwik";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigate$: (direction: "prev" | "next" | "today") => void;
}

export const CalendarHeader = component$<CalendarHeaderProps>(({ currentDate, onNavigate$ }) => {
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {monthName} <span className="text-gray-400 font-light">{year}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick$={() => onNavigate$("prev")}
          className="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          aria-label="Previous Month"
        >
          &larr; Prev
        </button>
        <button
          onClick$={() => onNavigate$("next")}
          className="bg-slate-300/80 hover:bg-slate-300 text-gray-900 font-medium text-sm px-5 py-3.5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          aria-label="Next Month"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
});