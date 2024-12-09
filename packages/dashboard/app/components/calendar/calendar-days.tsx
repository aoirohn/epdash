import holiday_jp from "@holiday-jp/holiday_jp";
import { addDays, eachDayOfInterval, format, isToday, startOfMonth, startOfWeek } from "date-fns";
import type { calendar_v3 } from "googleapis";
import { useMemo } from "react";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/utils/tailwind-merge";

type CalendarDaysProps = {
  holidaysData?: calendar_v3.Schema$Event[];
  eventsData?: calendar_v3.Schema$Event[];
};

export const CalendarDays = ({ holidaysData, eventsData }: CalendarDaysProps) => {
  const today = new Date();

  const startDay = startOfMonth(today);

  const holidaysMap = useMemo(() => {
    const holidays = holidaysData || [];
    const map: { [key: string]: calendar_v3.Schema$Event } = {};
    for (const holiday of holidays) {
      if (holiday.start?.date) {
        map[holiday.start.date] = holiday;
      }
    }
    return map;
  }, [holidaysData]);

  const eventsMap = useMemo(() => {
    const events = eventsData || [];
    const map: { [key: string]: calendar_v3.Schema$Event[] } = {};
    for (const event of events) {
      let date: string | undefined;

      if (event.start?.dateTime) {
        date = format(new Date(event.start.dateTime), "yyyy-MM-dd");
      } else if (event.start?.date) {
        date = event.start.date;
      }
      if (!date) {
        continue;
      }
      if (!map[date]) {
        map[date] = [];
      }
      map[date].push(event);
    }
    return map;
  }, [eventsData]);

  const startOfCalendar = startOfWeek(startDay);
  const endOfCalendar = addDays(startOfCalendar, 7 * 6 - 1);

  const calendarDates = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar,
  });

  const calendar = [];
  for (let i = 0; i < calendarDates.length; i += 7) {
    calendar.push(calendarDates.slice(i, i + 7));
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col glass">
        <div className="flex flex-row justify-around pt-2 pb-1 ">
          {[...Array(7)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <DateHeaderCell key={i} dayOfWeek={i} />
          ))}
        </div>
        <div className="flex flex-col justify-around flex-grow">
          {calendar.map((week, wi) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={wi} className="flex flex-row justify-around flex-grow">
              {week.map((day, di) => {
                return (
                  <DateCell
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={di}
                    today={today}
                    date={day}
                    holiday={holidaysMap[format(day, "yyyy-MM-dd")]}
                    events={eventsMap[format(day, "yyyy-MM-dd")]}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type DateHeaderCellProps = {
  dayOfWeek: number;
};

const DateHeaderCell = ({ dayOfWeek }: DateHeaderCellProps) => {
  const dows = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return <div className="w-10 text-center text-sm text-black">{dows[dayOfWeek]}</div>;
};

type DateCellProps = {
  today: Date;
  date: Date;
  holiday?: calendar_v3.Schema$Event;
  events?: calendar_v3.Schema$Event[];
};

const DateCell = ({ today, date, holiday, events }: DateCellProps) => {
  const isSameMonth = date.getMonth() === today.getMonth();
  const dow = date.getDay();

  // const { isHoliday, holidays } = holiday_jp;
  // const holiday = isHoliday(date) && holidays[format(date, "yyyy-MM-dd")];

  const lightColor = cn(
    "text-sub-dark-gray",
    dow === 0 && "text-sub-light-red",
    dow === 6 && "text-sub-light-blue",
    holiday && "text-sub-light-red",
  );

  const color = cn(
    "text-ep-black",
    dow === 0 && "text-ep-red",
    dow === 6 && "text-ep-blue",
    holiday && "text-ep-red",
    !isSameMonth && lightColor,
  );

  const bgColor = cn("bg-ep-black", dow === 0 && "bg-ep-red", dow === 6 && "bg-ep-blue", holiday && "bg-ep-red");

  return (
    <div className="w-8 flex flex-col items-center justify-start gap-1 py-2">
      <div
        className={cn("text-center w-8 h-8 leading-8 rounded-md", isToday(date) ? cn(bgColor, "text-white") : color)}
      >
        {date.getDate()}
      </div>
      <div className="flex flex-row gap-1 items-center justify-center">
        {events?.slice(0, 3)?.map((event, i) => (
          // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <svg key={i} width="3" height="3" viewBox="0, 0, 10, 10" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill={isSameMonth ? "#000000" : "#404040"} />
          </svg>
        ))}
      </div>
      {/* {holiday && <div>{holiday.name}</div>} */}
    </div>
  );
};
