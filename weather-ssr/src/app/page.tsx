import CityLink from "./components/CityLink";

const CITIES = ["Tokyo", "Hyogo", "Oita", "Hokkaido"] as const;

export const dynamic = "force-dynamic"; // SSR（常に動的）

export default function HomePage() {
  return (
    <main className="space-y-4">
      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">ホーム</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CITIES.map((c) => (
            <li key={c} className="card p-3">
              <CityLink city={c} />
            </li>
          ))}
          <li className="card p-3">
            <CityLink city="現在地" />
          </li>
        </ul>
      </section>
    </main>
  );
}