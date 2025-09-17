import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast";

export async function GET(req: NextRequest) {
  // クライアントから渡されたクエリパラメータを抽出
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const units = searchParams.get("units") ?? "metric";
  const lang = searchParams.get("lang") ?? "ja";

  // サーバー側に保持している OpenWeather API キーを取得
  const appid = process.env.OPENWEATHER_API_KEY;
  if (!appid) {
    // APIキーが設定されていない場合は 500 を返す
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  // OpenWeather API の実際のリクエスト URL を構築
  const url = new URL(ENDPOINT);
  if (q) url.searchParams.set("q", q);
  if (lat && lon) {                     // 位置情報指定
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
  }
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);
  url.searchParams.set("appid", appid); // サーバ側でAPIキーを付与

  // OpenWeather API へリクエスト送信（キャッシュ無効化）
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // エラー時はレスポンス本文をそのまま返却
    const text = await res.text();
    return NextResponse.json({ error: "upstream", detail: text }, { status: res.status });
  }

  // 正常時は取得した JSON データをそのまま返す
  const data = await res.json();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}