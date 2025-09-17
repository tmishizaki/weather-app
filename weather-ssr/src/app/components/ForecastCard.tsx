"use client";

import Image from "next/image";
import { ForecastCardProps } from "@/types/ForecastType"

export default function ForecastCard({
  timeLabel,
  iconUrl,
  iconAlt,
  tempC,
  priority = false,
}: ForecastCardProps) {
  return (
    <li className="card p-4">
      <div className="flex items-center gap-4">
        {iconUrl && (
          <Image
            alt={iconAlt}
            width={64}
            height={64}
            className="h-16 w-16"
            src={iconUrl}
            priority={priority}
          />
        )}
        <div className="min-w-0">
          <div className="truncate text-base font-semibold">{timeLabel}</div>
          <div className="text-sm text-gray-600">
            {iconAlt} ／ <span className="font-medium text-gray-900">{tempC}℃</span>
          </div>
        </div>
      </div>
    </li>
  );
}