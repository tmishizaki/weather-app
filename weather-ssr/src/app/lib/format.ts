
/**
 * UNIX秒タイムスタンプを日本時間（JST, Asia/Tokyo）に変換して
 * 「yyyy/MM/dd (曜) HH:mm」形式の文字列として返すユーティリティ関数。
 *
 * @param unixSec - UNIXエポック秒（秒単位）
 * @returns フォーマット済みの日付文字列（例: "2025/09/17(水) 12:34"）
 *
 * @example
 * ```ts
 * const ts = 1737150840; // 2025-01-18T03:34:00Z
 * console.log(formatJstFromUnixSec(ts));
 * // => "2025/01/18(土) 12:34"
 * ```
 */
export function formatJstFromUnixSec(unixSec: number) {
  const dt = new Date(unixSec * 1000);
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).format(dt);
}

/**
 * 現在日時を日本時間（JST, Asia/Tokyo）で評価し、
 * 「YYYY-MM-DD」形式の文字列キーを返すユーティリティ関数。
 *
 * 日付部分のみをキャッシュキーや識別子として使いたい場合に便利です。
 *
 * @returns JST基準の「YYYY-MM-DD」文字列（例: "2025-09-17"）
 *
 * @example
 * ```ts
 * console.log(todayKeyJst());
 * // => "2025-09-17"
 * ```
 */
export function todayKeyJst() {
  const now = new Date();
  const jst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const y = jst.getFullYear();
  const m = String(jst.getMonth() + 1).padStart(2, "0");
  const d = String(jst.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}