export function createRange(n: number, m: number) {
  const min = Math.min(n, m);
  const max = Math.max(n, m);

  return Array.from({ length: max - min + 1 }).map((_, i) => i + min);
}

export function toInteger(raw: number | string) {
  return typeof raw === "string" ? parseInt(raw) : raw;
}
