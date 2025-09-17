export type ForecastItem = {
  dt: number;
  main: { temp: number };
  weather: { 
    icon: string; 
    description: string 
  }[];
};

export type ForecastResponse = {
  list: ForecastItem[];
  city?: { name?: string };
};

type CityProps ={ 
    mode: "byCity"; 
    city: string 
}

type GeoProps = {
    mode: "byGeo";
    lat: number;
    lon: number;
    label?: string
}

export type ForecastListProps = CityProps | GeoProps;

export type ForecastCardProps = {
  keyText: string;          // React key としても使える識別子（表示には使わない）
  timeLabel: string;        // "2025/09/17(水) 12:00" など
  iconUrl?: string;         // openweathermap のアイコンURL
  iconAlt: string;          // 説明（例: "曇りがち"）
  tempC: number;            // 丸め済みの摂氏温度
  priority?: boolean;       // 先頭だけ優先読み込みしたい場合
};