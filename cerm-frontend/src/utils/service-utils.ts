/**
 * Safely parses services_requested from string, object, or undefined into a clean Record<string, boolean>
 */
export const parseServices = (raw: any): Record<string, boolean> => {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return typeof raw === "object" ? { ...raw } : {};
};

/**
 * Returns an array of enabled service names (e.g., ["Mowing", "Trimming"])
 */
export const getActiveServiceNames = (raw: any): string[] => {
  const parsed = parseServices(raw);
  return Object.entries(parsed)
    .filter(([_, isEnabled]) => Boolean(isEnabled))
    .map(([serviceName]) => serviceName);
};