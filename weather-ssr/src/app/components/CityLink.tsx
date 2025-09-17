"use client";

import { useRouter } from "next/navigation";

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
    <button onClick={go} className="btn-primary w-full text-base">
      {city}
    </button>
  );
}