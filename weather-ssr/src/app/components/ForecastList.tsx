"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { formatJstFromUnixSec, todayKeyJst } from "@/lib/format";
import { saveCache, loadCache } from "@/lib/cache";
import { fetchForecast } from "@/lib/api";
import { ForecastListProps, ForecastCardProps,  ForecastResponse } from "@/types/ForecastType";
import ForecastCard from "@/components/ForecastCard";




export default function ForecastList(props: ForecastListProps) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cityKey = useMemo(() => {
    if (props.mode === "byCity") {
      return props.city;
    }
    return props.label ? `geo:${props.label}` : `geo:${props.lat.toFixed(2)},${props.lon.toFixed(2)}`;
  }, [props]);

  const dateKey = todayKeyJst();

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const json = await fetchForecast(
      props.mode === "byCity"
        ? { mode: "byCity", city: props.city }
        : { mode: "byGeo",  lat: props.lat, lon: props.lon }
      );
      setData(json);
      saveCache(cityKey, dateKey, json); // 当日キャッシュ
    } catch (e) {
      if (e instanceof Error) {
        console.error("API fetch error:", e.message, e.stack);
      } else {
        console.error("Unexpected error:", e);
      }
      setError("通信に失敗しました。");
      const cached = loadCache<ForecastResponse>(cityKey, dateKey);
      if (cached){ 
        setData(cached);
      }
    } finally {
      setLoading(false);
    }
  },[cityKey, dateKey, props]);

  useEffect(() => { 
    fetcher(); 
  }, [fetcher]);

  if (loading && !data) {
    return (
      <div className="card p-6 text-center text-gray-600">読み込み中…</div>
    );
  }

  if (error && !data){
    return (
      <div className="card space-y-3 p-6">
        <p className="text-red-600">{error}</p>
        <button onClick={fetcher} className="btn-primary w-full sm:w-auto">リトライ</button>
      </div>
    );
  }

  if (!data){ 
    return null 
  };

  const title =
    data.city?.name ??
    (props.mode === "byCity" ? props.city : props.label ?? "現在地");

  const viewItems: ForecastCardProps[] = data.list.map((it, idx) => {
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

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-lg font-semibold">
          {title}
        </h3>
        {error &&  (
          <span className="text-sm text-red-600">（オフライン表示：キャッシュ）</span>
        )}
        
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
       {viewItems.map((v) => (
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

      {error && (
        <div className="pt-2">
          <button onClick={fetcher} className="btn-ghost">再取得</button>
        </div>
      )}
    </section>
  );
}