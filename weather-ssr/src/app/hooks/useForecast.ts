"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { todayKeyJst, formatJstFromUnixSec } from "@/lib/format";
import { saveCache, loadCache } from "@/lib/cache";
import { FetchByCity, FetchByGeo, ForecastResponse } from "@/types/FetchForecastType";
import { fetchForecast } from "@/lib/api";


/**
 * 予報取得＋当日キャッシュ＋ビューモデル生成をまとめたカスタムフック。
 * - 取得失敗時は localStorage 当日キャッシュへフェイルオーバー
 * - `viewItems` は描画用に最適化されたカード配列
 */
export function useForecast(input: FetchByCity | FetchByGeo) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 安定したキー（都市 or 現在地ラベル/座標）を生成
  const cityKey = useMemo(() => {
    if (input.mode === "byCity") return input.city;
    return `geo:${input.lat.toFixed(2)},${input.lon.toFixed(2)}`;
  }, [input]);

  const dateKey = todayKeyJst();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchForecast(input);
      setData(json);
      saveCache(cityKey, dateKey, json);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("API fetch error:", e.message, e.stack);
      } else {
        console.error("Unexpected error:", e);
      }
      setError("通信に失敗しました。");
      const cached = loadCache<ForecastResponse>(cityKey, dateKey);
      if (cached) setData(cached);
    } finally {
      setLoading(false);
    }
  }, [cityKey, dateKey, input]);

  useEffect(() => {
    // 初回・依存変化時に再取得
    refetch();
  }, [refetch]);

  // タイトル（JST名 or 入力値）
  const title = useMemo(() => {
    if (!data) return input.mode === "byCity" ? input.city : "現在地";
    return data.city?.name ?? (input.mode === "byCity" ? input.city : "現在地");
  }, [data, input]);

  // ビューモデル（JSX内での変数宣言を避けるためここで構築）
  const viewItems: ForecastCardProps[] = useMemo(() => {
    if (!data) return [];
    return data.list.map((it, idx) => {
      const icon = it.weather?.[0]?.icon;
      const desc = it.weather?.[0]?.description ?? "";
      const tempRounded = Math.round(it.main?.temp);
      const timeLabel = formatJstFromUnixSec(it.dt);
      const iconUrl = icon
        ? `https://openweathermap.org/img/wn/${icon}@2x.png`
        : undefined;

      return {
        keyText: `${it.dt}-${idx}`,
        timeLabel,
        iconUrl,
        iconAlt: desc,
        tempC: tempRounded,
        priority: idx < 4,
      };
    });
  }, [data]);

  return { data, error, loading, title, viewItems, refetch };
}