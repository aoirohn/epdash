import { format, startOfDay, subDays } from "date-fns";
import type { calendar_v3 } from "googleapis";
import { useEffect, useState } from "react";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/utils/tailwind-merge";

type EventsProps = {
  eventsData?: calendar_v3.Schema$Event[];
  className?: ClassNameValue;
};

export const Events = ({ eventsData, className }: EventsProps) => {
  if (!eventsData) {
    return (
      <div className={cn("w-full", className)}>
        <div className="h-full p-2 glass flex items-center justify-center">Fetch Failed</div>
      </div>
    );
  }

  const today = startOfDay(new Date());

  const events = eventsData
    .map((event) => {
      let startDate: Date | undefined = undefined;
      if (event.start?.dateTime) {
        startDate = new Date(event.start?.dateTime);
      } else if (event.start?.date) {
        startDate = new Date(event.start?.date);
      }

      let endDate: Date | undefined = undefined;
      if (event.end?.dateTime) {
        endDate = new Date(event.end?.dateTime);
      } else if (event.end?.date) {
        endDate = new Date(event.end?.date);
      }

      return { ...event, startDate, endDate };
    })
    .filter((event) => {
      if (!event.endDate) {
        return false;
      }
      return event.endDate >= today;
    })
    .sort((a, b) => {
      if (!a.startDate || !b.startDate) {
        return 0;
      }
      return a.startDate.getTime() - b.startDate.getTime();
    })
    .slice(0, 10);

  let prevStartDate: Date | undefined = undefined;
  // const today = startOfDay(new Date());
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full h-full p-2 glass">
        {events.map((event) => {
          let startDate: Date | undefined = undefined;
          if (event.start?.dateTime) {
            startDate = new Date(event.start?.dateTime);
          } else if (event.start?.date) {
            startDate = new Date(event.start?.date);
          }

          const skipDate =
            startDate?.getDate() === prevStartDate?.getDate() && startDate?.getMonth() === prevStartDate?.getMonth();
          prevStartDate = startDate;
          return <Event key={event.id} event={event} skipDate={skipDate} />;
        })}
      </div>
    </div>
  );
};

type EventProps = {
  event: calendar_v3.Schema$Event;
  skipDate?: boolean;
};

const Event = ({ event, skipDate }: EventProps) => {
  const allDay = event.start?.date && event.end?.date;

  if (allDay) {
    return <DayEvent event={event} skipDate={skipDate} />;
  }
  return <TimeEvent event={event} skipDate={skipDate} />;
};

const TimeEvent = ({ event, skipDate }: EventProps) => {
  const start = event.start?.dateTime ? new Date(event.start?.dateTime) : undefined;
  const end = event.end?.dateTime ? new Date(event.end?.dateTime) : undefined;

  let date = "";
  if (!skipDate) {
    date = start ? format(start, "MM/dd") : end ? format(end, "MM/dd") : "";
  }

  let time = "";
  if (start && end) {
    if (start.getDay() === end.getDay()) {
      time = `${format(start, "HH:mm")}〜${format(end, "HH:mm")}`;
    } else {
      time = `${format(start, "HH:mm")}〜${format(end, "MM/dd HH:mm")}`;
    }
  } else if (start) {
    time = `${format(start, "HH:mm")}〜`;
  } else if (end) {
    time = `〜${format(end, "HH:mm")}`;
  }

  return (
    <div className="text-base w-full flex flex-row items-center justify-start tabular-nums gap-2">
      <div className="flex-shrink-0 text-right w-[50px]">{date}</div>
      <div className="flex-shrink-0 text-left min-w-[110px]">{time}</div>
      <div className="text-left inline-block whitespace-nowrap truncate ml-1">{event.summary}</div>
    </div>
  );
};

const DayEvent = ({ event, skipDate }: EventProps) => {
  const start = event.start?.date ? new Date(event.start?.date) : undefined;
  const end = event.end?.date ? subDays(new Date(event.end?.date), 1) : undefined;

  let date = "";
  if (!skipDate) {
    date = start ? format(start, "MM/dd") : end ? format(end, "MM/dd") : "";
  }

  let time: React.ReactNode = "";
  if (start && end) {
    if (start.getDay() === end.getDay()) {
      time = "All day";
    } else {
      time = (
        <>
          <span className="inline-block mr-2">〜</span>
          {format(end, "MM/dd")}
        </>
      );
    }
  } else {
    time = "All day";
  }

  return (
    <div className="text-base w-full flex flex-row items-center justify-start tabular-nums gap-2">
      <div className="flex-shrink-0 text-right w-[50px]">{date}</div>
      <div className="flex-shrink-0 text-left min-w-[110px]">{time}</div>
      <div className="text-left inline-block whitespace-nowrap truncate ml-1">{event.summary}</div>
    </div>
  );
};
