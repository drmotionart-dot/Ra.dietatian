export function sanitizeString(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 5000);
}

export function sanitizeArray(arr: string[] | undefined | null): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(sanitizeString).filter(Boolean);
}
