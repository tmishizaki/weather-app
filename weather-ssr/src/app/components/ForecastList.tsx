"use client"; // このコンポーネントはクライアント専用。useState/useEffectを内部で利用するため必須。

import { useForecast } from "@/hooks/useForecast";      // 天気データ取得＋キャッシュ処理をまとめたカスタムフック
import ForecastCard from "@/components/ForecastCard";   // 予報1件を表示する小さなカードコンポーネント
import {ForecastListProps} from "@/types/ForecastType"  // プロパティの型定義

/**
 * 天気予報リストを表示するコンポーネント。
 * - データ取得やキャッシュ処理は useForecast に任せ、ここでは描画に集中。
 * - ローディング、エラー、データありの3つの状態を分岐して表示する。
 */
export default function ForecastList(props: ForecastListProps) {
  // useForecast でデータと状態を取得
  const { data, error, loading, title, viewItems, refetch } = useForecast(props);

  // ローディング中（まだdataなし）
  if (loading && !data) {
    return <div className="card p-6 text-center text-gray-600">読み込み中…</div>;
  }

  // エラー時（キャッシュもなし）
  if (error && !data) {
    return (
      <div className="card space-y-3 p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={refetch} className="btn-primary w-full sm:w-auto">リトライ</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {error && <span className="text-sm text-red-600">（オフライン表示：キャッシュ）</span>}
      </div>

      {/* 予報カードの一覧 */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {viewItems.map(v => (
          <ForecastCard
            key={v.keyText}
            keyText={v.keyText}
            timeLabel={v.timeLabel}
            iconUrl={v.iconUrl}
            iconAlt={v.iconAlt}
            tempC={v.tempC}
            priority={v.priority}
          />
        ))}
      </ul>

      {/* データは表示できたがエラーがある（＝キャッシュ利用中）場合に再取得ボタンを出す */}
      {error && (
        <div className="pt-2">
          <button onClick={refetch} className="btn-ghost">再取得</button>
        </div>
      )}
    </section>
  );
}