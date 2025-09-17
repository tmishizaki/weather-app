import { API_FORECAST_PATH } from "./endpoints";
import { FetchByCity, FetchByGeo, ForecastResponse  } from "@/types/FetchForecastType";



export async function fetchForecast(input: FetchByCity | FetchByGeo): Promise<ForecastResponse> {
    const params = new URLSearchParams({ units: "metric", lang: "ja" });
    if (input.mode === "byCity") {
        params.set("q", input.city);
    } else { 
        params.set("lat", String(input.lat)); 
        params.set("lon", String(input.lon)); 
    }
    const fetchUrl = `${API_FORECAST_PATH}?${params.toString()}`;

        console.log(`api: ${fetchUrl}`);

    const res = await fetch(fetchUrl, { cache: "no-store" });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`forecast failed: ${res.status} ${detail}`);
    }

    return res.json() as Promise<ForecastResponse>;
}