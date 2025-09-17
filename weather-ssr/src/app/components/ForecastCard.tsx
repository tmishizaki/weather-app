"use client";

import Image from "next/image";
import { ForecastCardProps } from "@/types/ForecastType"

/**
 * 個々の天気予報アイテムをカード形式で表示するプレゼンテーションコンポーネント。
 * アイコン画像・日時（JST）・天気の説明・気温をレイアウトして表示する。
 *
 * - 画像は OpenWeatherMap のアイコンを next/image で最適化して表示
 * - 日時は `formatJstFromUnixSec` を用いて日本時間に変換済み
 *
 * @param props - 予報データ 1 件分を表すプロパティ
 * @param props.dt - UNIX 秒の時刻（UTC）
 * @param props.icon - 天気アイコンの ID（例: "02n"）
 * @param props.desc - 天気の説明文（例: "くもり"）
 * @param props.temp - 摂氏気温
 *
 * @example
 * ```tsx
 * <ForecastCard
 *   dt={1737150840}
 *   icon="02n"
 *   desc="くもり"
 *   temp={18}
 * />
 * ```
 */
export default function ForecastCard({
  timeLabel,
  iconUrl,
  iconAlt,
  tempC,
  priority = false,
}: ForecastCardProps) {
  return (
    <li className="card p-4">
      <div className="flex items-center gap-4">
        {iconUrl && (
          <Image
            alt={iconAlt}
            width={64}
            height={64}
            className="h-16 w-16"
            src={iconUrl}
            priority={priority}
          />
        )}
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{timeLabel}</div>
          <div className="text-sm text-gray-600">
            {iconAlt} ／ <span className="font-medium text-gray-900">{tempC}℃</span>
          </div>
        </div>
      </div>
    </li>
  );
}