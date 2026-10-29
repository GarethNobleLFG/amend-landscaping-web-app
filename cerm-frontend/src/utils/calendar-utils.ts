export interface CalendarDayMeta {
  date: Date;
  dayNumber: number;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  isToday: boolean;
  dateKey: string; // "YYYY-MM-DD"
}

/**
 * Returns the total number of days in a given month and year (zero-based month).
 */
export function getDaysInMonth(year: number, monthZeroBased: number): number {
  return new Date(year, monthZeroBased + 1, 0).getDate();
}

/**
 * Returns the starting day of the week (0-6) for the first day of the month.
 */
export function getFirstDayOfMonth(year: number, monthZeroBased: number): number {
  return new Date(year, monthZeroBased, 1).getDay();
}

export function buildMonthGrid(
  year: number,
  monthZeroBased: number
): { startingDayOfWeek: number; days: CalendarDayMeta[] } {
  const today = new Date();
  const startingDayOfWeek = getFirstDayOfMonth(year, monthZeroBased);
  const daysInMonth = getDaysInMonth(year, monthZeroBased);

  const days: CalendarDayMeta[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthZeroBased, day);
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    days.push({
      date,
      dayNumber: day,
      dayOfWeek: date.getDay(),
      isToday,
      dateKey: formatDateKey(date),
    });
  }

  return { startingDayOfWeek, days };
}

export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}