"use client";

import { useRouter } from "next/navigation";

/**
 * 指定された都市へのリンクを生成するコンポーネント。
 * クリックすると `/weather/[city]` ページへ遷移し、その都市の天気予報を表示できる。
 *
 * - Next.js の `<Link>` を利用してクライアントサイドナビゲーションを実現
 * - 都市名は自動的にエンコードされ、URL パラメータに安全に渡される
 *
 * @param props - コンポーネントのプロパティ
 * @param props.city - 遷移先の都市名（例: "Tokyo"）
 * @param props.children - リンク内に表示する要素（テキストやアイコン）
 *
 * @example
 * ```tsx
 * <CityLink city="Tokyo">東京の天気</CityLink>
 * <CityLink city="兵庫">
 *   <span className="font-bold">兵庫</span> の天気
 * </CityLink>
 * ```
 */
export default function CityLink({ city }: { city: string }) {
  const router = useRouter();

  const go = () => {
    if (city === "現在地") {
      if (!("geolocation" in navigator)) {
        alert("位置情報が使用できません");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          router.push(`/weather/geo?lat=${latitude}&lon=${longitude}`);
        },
        () => alert("現在地の取得に失敗しました"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      router.push(`/weather/${encodeURIComponent(city)}`);
    }
  };

  return (
    <button onClick={go} className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300">
      {city}
    </button>
  );
}