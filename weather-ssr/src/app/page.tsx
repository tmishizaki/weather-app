import CityLink from "./components/CityLink";

const CITIES = ["Tokyo", "Hyogo", "Oita", "Hokkaido"] as const;

export const dynamic = "force-dynamic"; // SSR（常に動的）

export default function HomePage() {
  return (
    <main className="space-y-4">
      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">ホーム</h2>
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          {CITIES.map((c) => (
            <li key={c} className="me-2">
              <CityLink city={c} />
            </li>
          ))}
          <li className="me-2">
            <CityLink aria-current="page" city="現在地" />
          </li>
        </ul>
      </section>
    </main>
  );
}