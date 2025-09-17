import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const units = searchParams.get("units") ?? "metric";
  const lang = searchParams.get("lang") ?? "ja";

  const appid = process.env.OPENWEATHER_API_KEY;
  if (!appid) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const url = new URL(ENDPOINT);
  if (q) url.searchParams.set("q", q);
  if (lat && lon) { url.searchParams.set("lat", lat); url.searchParams.set("lon", lon); }
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);
  url.searchParams.set("appid", appid);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: "upstream", detail: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}