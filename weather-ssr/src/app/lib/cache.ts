type AnyJson = unknown;

export function cacheKey(cityKey: string, dateKey: string) {
  return `weather:${cityKey}:${dateKey}`;
}

export function saveCache(cityKey: string, dateKey: string, data: AnyJson) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(cacheKey(cityKey, dateKey), JSON.stringify({ savedAt: Date.now(), data }));
  } catch {}
}

export function loadCache<T = AnyJson>(cityKey: string, dateKey: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(cacheKey(cityKey, dateKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}