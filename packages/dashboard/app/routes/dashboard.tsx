import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import type { ClassNameValue } from "tailwind-merge";
import { Anniversary, type AnniversaryAPIResponse, getAnniversary } from "~/components/anniversary/anniversary";
import { Calendar } from "~/components/calendar/calendar";
import { Events } from "~/components/events/events";
import { getCalendarEvents, getHolidayEvents } from "~/components/events/getEvent";
import { Weather, openWeather } from "~/components/weather/weather";
import DCache from "~/features/cache/cache";
import { cn } from "~/utils/tailwind-merge";

export const loader = async () => {
  let anniv = DCache.getInstance().get<AnniversaryAPIResponse>("anniv");
  if (!anniv || format(new Date(), "MMdd") !== anniv?.mmdd) {
    anniv = await getAnniversary();
    DCache.getInstance().set("anniv", anniv, 24 * 60 * 60 * 1000);
  }

  const weather = await openWeather.getEverything();

  const calendarId = process.env.CALENDAR_ID;
  const events = calendarId ? await getCalendarEvents(calendarId) : undefined;
  const holidayEvents = await getHolidayEvents("ja.japanese#holiday@group.v.calendar.google.com");

  return {
    anniv,
    weather,
    events,
    holidayEvents,
  };
};

export default function Dashboard() {
  const { anniv, weather, events, holidayEvents } = useLoaderData<typeof loader>();

  const eventsSum = events && holidayEvents ? [...(events ?? []), ...(holidayEvents ?? [])] : undefined;

  return (
    <div className={cn("h-[480px] w-[800px] flex flex-row p-4 gap-4 bg-cover bg-center", bgClsName())}>
      <div className="flex-grow basis-0 min-w-0">
        <Calendar holidaysData={holidayEvents} eventsData={events} />
      </div>
      <div className="flex-grow basis-0 min-w-0 flex flex-col gap-2">
        <Anniversary annivData={anniv} className="h-[64px] flex-grow-0 flex-shrink-0" />
        <div className="h-full flex flex-col gap-4">
          <Weather weatherData={weather} className="h-[100px]" />
          <Events eventsData={eventsSum} className="flex-grow" />
        </div>
      </div>
    </div>
  );
}

const bgClsName = (): ClassNameValue => {
  const month = format(new Date(), "MM");

  switch (month) {
    case "01":
      return cn("bg-[url('/img/01.jpg')]");
    case "02":
      return cn("bg-[url('/img/02.jpg')]");
    case "03":
      return cn("bg-[url('/img/03.jpg')]");
    case "04":
      return cn("bg-[url('/img/04.jpg')]");
    case "05":
      return cn("bg-[url('/img/05.jpg')]");
    case "06":
      return cn("bg-[url('/img/06.jpg')]");
    case "07":
      return cn("bg-[url('/img/07.jpg')]");
    case "08":
      return cn("bg-[url('/img/08.jpg')]");
    case "09":
      return cn("bg-[url('/img/09.jpg')]");
    case "10":
      return cn("bg-[url('/img/10.jpg')]");
    case "11":
      return cn("bg-[url('/img/11.jpg')]");
    case "12":
      return cn("bg-[url('/img/12.jpg')]");
    default:
      return cn("bg-[url('/img/bg.png')]");
  }
};
