import { useLoaderData } from "@remix-run/react";
import { Anniversary, getAnniversary } from "~/components/anniversary/anniversary";
import { Calendar } from "~/components/calendar/calendar";
import { Events } from "~/components/events/events";
import { getCalendarEvents } from "~/components/events/getEvent";
import { Weather, openWeather } from "~/components/weather/weather";
import { cn } from "~/utils/tailwind-merge";

export const loader = async () => {
  const anniv = await getAnniversary();

  const locationId = process.env.WEATHER_LOCATION_ID;

  const weather = await openWeather.getEverything();

  const calendarId = process.env.CALENDAR_ID;
  const events = calendarId ? await getCalendarEvents(calendarId) : undefined;

  return {
    anniv,
    weather,
    events,
  };
};

export default function Dashboard() {
  const { anniv, weather, events } = useLoaderData<typeof loader>();

  return (
    <div className={cn("h-[480px] w-[800px] flex flex-row bg-[url('img/bg.png')] p-4 gap-4")}>
      <div className="flex-grow basis-0 min-w-0">
        <Calendar />
      </div>
      <div className="flex-grow basis-0 min-w-0 flex flex-col gap-2">
        <Anniversary annivData={anniv} className="h-[64px] flex-grow-0 flex-shrink-0" />
        <div className="h-full flex flex-col gap-4">
          <Weather weatherData={weather} className="h-[100px]" />
          <Events eventsData={events} className="flex-grow" />
        </div>
      </div>
    </div>
  );
}
