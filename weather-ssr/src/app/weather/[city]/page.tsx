import ForecastList from "@/components/ForecastList";
import { WeatherByCityPageProps } from "@/types/WeatherByCityType";

export const dynamic = "force-dynamic"; // 毎回SSR

export default async function WeatherByCityPage({ params }: WeatherByCityPageProps) {
  const { city } = await params; // await が必須になった
  const decodedCity = decodeURIComponent(city);

  return (
    <main className="space-y-4">
      <ForecastList mode="byCity" city={decodedCity} />
    </main>
  );
}