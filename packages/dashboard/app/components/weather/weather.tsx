import { format } from "date-fns";
import { he } from "date-fns/locale";
import { type Everything, type HourlyWeather, OpenWeatherAPI } from "openweather-api-node";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/utils/tailwind-merge";
import { UmbrellaIcon } from "./icons/umbrella";
import { WaterDropIcon } from "./icons/waterDrop";

type WeatherProps = {
  weatherData?: Everything;
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

  const current = weatherData.current;

  const d0 = weatherData.daily[0];
  const d1 = weatherData.daily[1];

  return (
    <div className={cn("w-full", className)}>
      <div className="h-full p-2 glass">
        <div className="flex flex-row items-center justify-start h-full gap-1">
          <div>
            <div className="flex flex-row items-center justify-start">
              <img
                className="w-[60px] h-[45px] object-cover"
                src={current.weather.icon.url}
                alt={current.weather.description}
              />
              <div>
                <div className="text-xs">{process.env.OPEN_WEATHER_MAP_LOCATION_NAME}</div>
                <div className="text-2xl">{Math.round(current.weather.temp.cur)}℃</div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-start">
              <div className="flex flex-row items-center gap-0.5 w-[60px]">
                <WaterDropIcon className="w-[16px] h-[16px]" />
                <div>{current.weather.humidity}%</div>
              </div>
              <div className="flex flex-row items-center gap-0.5">
                <UmbrellaIcon className="w-[16px] h-[16px]" />
                <div>{current.weather.rain}%</div>
              </div>
            </div>
          </div>
          <div className="w-[200px] h-[100px] ">
            <Charts width={186} height={100} hourlyWeathers={weatherData.hourly} />
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="flex flex-row items-center justify-end">
              <TomorrowMarker className="w-4" />
              <img className="w-[50px] h-[40px] object-cover" src={d0.weather.icon.url} alt={d0.weather.description} />
            </div>

            <div className="flex flex-row items-center justify-end">
              <DayAfterTomorrowMarker className="w-4" />
              <img className="w-[50px] h-[40px] object-cover" src={d1.weather.icon.url} alt={d1.weather.description} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ChartsProps = {
  width: number;
  height: number;
  hourlyWeathers: HourlyWeather[];
  className?: ClassNameValue;
};

const Charts = ({ hourlyWeathers, width, height, className }: ChartsProps) => {
  const data = hourlyWeathers.map((hourlyWeather) => ({
    ...hourlyWeather.weather,
    temp: hourlyWeather.weather.temp.cur,
    feelsLike: hourlyWeather.weather.feelsLike.cur,
    date: new Date(hourlyWeather.dtRaw * 1000),
    dateStr: format(new Date(hourlyWeather.dtRaw * 1000), "MM/dd HH:00"),
  }));

  const m = {
    t: 25,
    r: 25,
    b: 20,
    l: 17,
  };
  const chartWidth = width - m.l - m.r;
  const chartHeight = height - m.t - m.b;
  const origin = {
    x: m.l,
    y: height - m.b,
  };

  const length = data.length;
  const tempMax = Math.ceil((Math.max(...data.map((d) => d.temp)) * 1.05) / 5) * 5;
  const tempMin = Math.floor((Math.min(...data.map((d) => d.temp)) * 0.95) / 5) * 5;
  const tempDiff = tempMax - tempMin;
  const tempLine = data.reduce((acc, cur, i) => {
    return `${acc} ${m.l + (i / (length - 1)) * chartWidth},${origin.y - ((cur.temp - tempMin) / tempDiff) * chartHeight} `;
  }, "");

  const rainMax = Math.ceil((Math.max(...data.map((d) => d.rain)) + 0.01 * 1.05) / 5) * 5;
  const rainMin = Math.floor((Math.min(...data.map((d) => d.rain)) * 0.95) / 5) * 5;
  const rainDiff = rainMax - rainMin;
  const rainLine = data.slice(0, length - 1).reduce((acc, cur, i) => {
    const y = origin.y - (cur.rain / rainDiff) * chartHeight;
    return `${acc} ${m.l + (i / length) * chartWidth},${y} ${m.l + ((i + 1) / length) * chartWidth},${y}`;
  }, "");
  const rainArea = `${rainLine} ${width - m.r},${origin.y} ${origin.x},${origin.y}`;

  const dateTicks = data.flatMap((d, i) => {
    const h = d.date.getHours();
    const nodes = [];
    if (h === 0) {
      nodes.push(
        <text
          key={d.dateStr}
          x={`${m.l + (i / length) * chartWidth}`}
          y={`${origin.y + 14}`}
          fontSize="12"
          fill="#000"
          textAnchor="middle"
        >
          {`${format(d.date, "M/d")}`}
        </text>,
      );
    }
    if (h % 6 === 0) {
      nodes.push(
        <line
          key={d.dateStr}
          x1={`${m.l + (i / length) * chartWidth}`}
          x2={`${m.l + (i / length) * chartWidth}`}
          y1={`${origin.y - (h % 24 === 0 ? 2 : 0)}`}
          y2={`${origin.y + (h % 12 === 0 ? 3 : 2)}`}
          stroke="#000"
        />,
      );
    }
    return nodes;
  });

  const yTicks = [];
  let i = tempMin + 5;
  while (i <= tempMax) {
    yTicks.push(
      <line
        key={i}
        x1={`${m.l - (i % 10 === 0 ? 3 : 2)}`}
        x2={`${m.l + (i % 10 === 0 ? 2 : 0)}`}
        y1={`${origin.y - ((i - tempMin) / tempDiff) * chartHeight}`}
        y2={`${origin.y - ((i - tempMin) / tempDiff) * chartHeight}`}
        stroke="#000"
      />,
    );
    i += 5;
  }

  const y2Ticks = [];
  let j = rainMin + 5;
  while (j <= rainMax) {
    y2Ticks.push(
      <line
        key={j}
        x1={`${m.l + chartWidth - (j % 10 === 0 ? 2 : 0)}`}
        x2={`${m.l + chartWidth + (j % 10 === 0 ? 3 : 2)}`}
        y1={`${origin.y - ((j - rainMin) / rainDiff) * chartHeight}`}
        y2={`${origin.y - ((j - rainMin) / rainDiff) * chartHeight}`}
        stroke="#000"
      />,
    );
    j += 5;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn(className)}
      width={width}
      height={height}
    >
      <title>chart</title>

      <polygon points={rainArea} fill="#0000ff" opacity="0.4" />
      <polyline points={tempLine} stroke="#ff8000" fill="none" strokeWidth="2" />

      {/* axis */}
      <polyline
        points={`${origin.x},${m.t - 5} ${origin.x},${origin.y} ${width - m.r},${origin.y} ${width - m.r},${m.t - 5}`}
        stroke="#000"
        fill="none"
      />

      {/* yAxis */}
      <text textAnchor="end" x={`${origin.x - 4}`} y={`${origin.y}`} fontSize="12" fill="#000">
        {tempMin}
      </text>
      <text textAnchor="end" x={`${origin.x - 4}`} y={`${m.t + 5}`} fontSize="12" fill="#000">
        {tempMax}
      </text>
      <text textAnchor="end" x={`${origin.x - 4}`} y={`${m.t - 7}`} fontSize="12" fill="#000">
        ℃
      </text>
      {/* yAxis ticks*/}
      {yTicks}
      {y2Ticks}

      {/* 2nd yAxis */}
      <text textAnchor="start" x={`${width - m.r + 4}`} y={`${origin.y}`} fontSize="12" fill="#000">
        {rainMin}
      </text>
      <text textAnchor="start" x={`${width - m.r + 4}`} y={`${m.t + 5}`} fontSize="12" fill="#000">
        {rainMax}
      </text>
      <text textAnchor="start" x={`${width - m.r + 4}`} y={`${m.t - 7}`} fontSize="12" fill="#000">
        mm
      </text>

      {/* xAxis */}
      {dateTicks}
    </svg>
  );
};

type IconProps = {
  width?: string;
  height?: string;
  className?: ClassNameValue;
};

const TomorrowMarker = ({ className, width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 16, 16" fill="black" className={cn(className)}>
      <title>tmrw</title>
      <polygon points="8 3, 8 13, 16 8 " />
    </svg>
  );
};

const DayAfterTomorrowMarker = ({ className, width, height }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 16, 16" fill="black" className={cn(className)}>
      <title>dat</title>
      <polygon points="8 3, 8 13, 16 8 " />
      <polygon points="0 3, 0 13, 8 8 " />
    </svg>
  );
};

export const openWeather = new OpenWeatherAPI({
  key: process.env.OPEN_WEATHER_MAP_API_KEY,
  locationName: process.env.OPEN_WEATHER_MAP_LOCATION_NAME,
  units: "metric",
});
