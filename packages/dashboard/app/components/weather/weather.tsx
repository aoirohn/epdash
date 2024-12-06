import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/utils/tailwind-merge";

type WeatherProps = {
  weatherData?: WeatherAPIResponse;
  className?: ClassNameValue;
};

export const Weather = ({ weatherData, className }: WeatherProps) => {
  if (!weatherData) {
    return (
      <div className="w-full h-[100px]">
        <div className="h-full p-2 glass flex items-center justify-center">Fetch Failed</div>
      </div>
    );
  }

  const f0 = weatherData?.forecasts[0];
  const f1 = weatherData?.forecasts[1];
  const f2 = weatherData?.forecasts[2];

  const chanceOfRain = Math.ceil(
    (Number.parseInt(f0.chanceOfRain.T06_12, 10) ?? 0 + Number.parseInt(f0.chanceOfRain.T12_18, 10) ?? 0) / 2,
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="h-full p-2 glass">
        <div className="flex flex-row items-center justify-between h-full gap-1">
          <div className="flex flex-col items-center justify-center gap-1 w-[90px]">
            <div className="text-3xl">{weatherData?.location.city}</div>
            <div className="text-lg">{f0.telop}</div>
          </div>
          <img className="w-[120px] h-[90px]" src={f0.image.url} alt={f0.image.title} width={80} height={60} />
          <div className="flex flex-col items-center justify-center w-[60px] text-lg">
            <div className="flex items-end h-[25px] text-ep-red">
              <span className="inline-block text-right w-[30px]">{f0.temperature.max.celsius ?? "-"}</span>
              <span className="inline-block text-base w-[30px] text-center pl-0.5">℃</span>
            </div>
            <div className="flex items-end h-[25px] text-ep-blue">
              <span className="inline-block text-right w-[30px]">{f0.temperature.min.celsius ?? "-"} </span>
              <span className="inline-block text-base w-[30px] text-center pl-0.5">℃</span>
            </div>
            <div className="flex items-end h-[25px] text-sub-dark-gray">
              <span className="inline-block text-right w-[30px]">{chanceOfRain}</span>
              <span className="inline-block text-base w-[30px] text-center pl-0.5">%</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center h-full flex-grow">
            <div className="flex flex-row items-center justify-center">
              <TommorowMarker />
              <img className="w-[53px] h-[40px]" src={f1.image.url} alt={f1.image.title} width={53} height={40} />
            </div>
            <div className="flex flex-row items-center justify-center">
              <DayAfterTomorrowMarker />
              <img className="w-[53px] h-[40px]" src={f2.image.url} alt={f2.image.title} width={53} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TommorowMarker = () => {
  return (
    <svg width="16" height="16">
      <title>tmrw</title>
      <polygon points="8 3, 8 13, 16 8 " />
    </svg>
  );
};

const DayAfterTomorrowMarker = () => {
  return (
    <svg width="16" height="16">
      <title>dat</title>
      <polygon points="8 3, 8 13, 16 8 " />
      <polygon points="0 3, 0 13, 8 8 " />
    </svg>
  );
};

// const CITY_CODE = "130010"; // 東京;
const endpointUrl = "https://weather.tsukumijima.net/api/forecast/city";

export const getWeather = async (cityCode: string): Promise<WeatherAPIResponse> => {
  const url = `${endpointUrl}/${cityCode}`;
  const res = await fetch(url);
  return res.json();
};

type Forecast = {
  date: string;
  dateLabel: string;
  telop: string;
  detail: {
    weather: string | null;
    wind: string | null;
    wave: string | null;
  };
  temperature: {
    min: {
      celsius: string;
    };
    max: {
      celsius: string;
    };
  };
  chanceOfRain: {
    T00_06: string;
    T06_12: string;
    T12_18: string;
    T18_24: string;
  };
  image: {
    title: string;
    url: string;
    width: number;
    height: number;
  };
};
export type WeatherAPIResponse = {
  publicTime: string;
  publicTimeFormatted: string;
  publishingOffice: string;
  title: string;
  link: string;
  description: {
    publicTime: string;
    publicTimeFormatted: string;
    headlineText: string;
    bodyText: string;
    text: string;
  };
  forecasts: [Forecast, Forecast, Forecast];
  location: {
    area: string;
    prefecture: string;
    district: string;
    city: string;
  };
};
