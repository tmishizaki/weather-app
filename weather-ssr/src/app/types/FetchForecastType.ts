// Fetch時に必要な型定義

export type ForecastItem = {
  dt: number;
  main: { temp: number };
  weather: { icon: string; description: string }[];
};
export type ForecastResponse = { list: ForecastItem[]; city?: { name?: string } };

export type FetchByCity = { mode: "byCity"; city: string };
export type FetchByGeo  = { mode: "byGeo"; lat: number; lon: number };