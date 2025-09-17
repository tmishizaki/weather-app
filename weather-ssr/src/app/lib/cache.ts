type AnyJson = unknown;

/**
 * 都市キーと日付キーからキャッシュ用のユニークなキー文字列を生成する。
 *
 * @param cityKey - 都市を表す文字列キー（例: "Tokyo" や "geo:35.6,139.7"）
 * @param dateKey - 日付キー（例: "2025-09-17"）
 * @returns `weather:{cityKey}:{dateKey}` 形式のキャッシュキー
 */
export function cacheKey(cityKey: string, dateKey: string) {
  return `weather:${cityKey}:${dateKey}`;
}

/**
 * 指定した都市キーと日付キーに対応するキャッシュデータを保存する。
 * ブラウザ環境（localStorage）が前提で、サーバーサイドでは無視される。
 *
 * @param cityKey - 都市キー
 * @param dateKey - 日付キー
 * @param data - 保存する任意のJSONデータ
 */
export function saveCache(cityKey: string, dateKey: string, data: AnyJson) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(cacheKey(cityKey, dateKey), JSON.stringify({ savedAt: Date.now(), data }));
  } catch {}
}

/**
 * 指定した都市キーと日付キーに対応するキャッシュデータを読み込む。
 * データが存在しない、またはパースに失敗した場合は `null` を返す。
 *
 * @param cityKey - 都市キー
 * @param dateKey - 日付キー
 * @returns キャッシュされていたデータ（型パラメータTで型指定可）、または null
 *
 * @example
 * ```ts
 * const cached = loadCache<ForecastResponse>("Tokyo", "2025-09-17");
 * if (cached) {
 *   console.log("キャッシュから復元:", cached);
 * }
 * ```
 */
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