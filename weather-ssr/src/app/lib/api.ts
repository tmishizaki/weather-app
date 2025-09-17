import { API_FORECAST_PATH } from "./endpoints";
import { FetchByCity, FetchByGeo, ForecastResponse  } from "@/types/FetchForecastType";


/**
 * 天気予報データをアプリ内 API（/api/forecast）経由で取得する非同期関数。
 * クライアント側からは都市名または緯度経度を指定するだけで、
 * サーバ側で OpenWeather API キーが付与されて安全に外部 API にリクエストされる。
 *
 * @param input - 取得方法を表すオブジェクト
 * - { mode: "byCity"; city: string } : 都市名で取得
 * - { mode: "byGeo"; lat: number; lon: number } : 緯度経度で取得
 *
 * @returns OpenWeather 5日間/3時間ごとの予報レスポンス
 *
 * @throws {Error} fetch が失敗した場合やレスポンスが不正な場合に例外を投げる
 *
 */
export async function fetchForecast(input: FetchByCity | FetchByGeo): Promise<ForecastResponse> {
    const params = new URLSearchParams({ units: "metric", lang: "ja" });
    if (input.mode === "byCity") {
        params.set("q", input.city);
    } else { 
        params.set("lat", String(input.lat)); 
        params.set("lon", String(input.lon)); 
    }
    const fetchUrl = `${API_FORECAST_PATH}?${params.toString()}`;

    const res = await fetch(fetchUrl, { cache: "no-store" });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`forecast failed: ${res.status} ${detail}`);
    }

    return res.json() as Promise<ForecastResponse>;
}