// --- EST Date & Formatting Utilities ---

export function getESTDate(date = new Date()): Date {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  return new Date(year, month, day);
}

export function getMonday(d: Date): Date {
  const estDate = getESTDate(d);
  const day = estDate.getDay();
  const diff = estDate.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(estDate.setDate(diff));
}

export function parseLocalDate(isoString: string): Date {
  const [year, month, day] = isoString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}