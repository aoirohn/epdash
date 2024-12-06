import holiday_jp from "@holiday-jp/holiday_jp";
import { addDays, eachDayOfInterval, format, isToday, startOfMonth, startOfWeek } from "date-fns";
import { cn } from "~/utils/tailwind-merge";

export const CalendarDays = () => {
  const today = new Date();

  const startDay = startOfMonth(today);

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
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                return <DateCell key={di} today={today} date={day} />;
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
};

const DateCell = ({ today, date }: DateCellProps) => {
  const isSameMonth = date.getMonth() === today.getMonth();
  const dow = date.getDay();

  const { isHoliday, holidays } = holiday_jp;
  const holiday = isHoliday(date) && holidays[format(date, "yyyy-MM-dd")];

  const color = cn(
    "text-ep-black",
    dow === 0 && "text-ep-red",
    dow === 6 && "text-ep-blue",
    holiday && "text-ep-red",
    !isSameMonth && "text-sub-dark-gray",
  );

  const bgColor = cn(
    "bg-ep-black",
    dow === 0 && "bg-ep-red",
    dow === 6 && "bg-ep-blue",
    holiday && "bg-ep-red",
    !isSameMonth && "bg-sub-dark-gray",
  );

  return (
    <div className="w-8 flex flex-col items-center justify-center py-2">
      <div
        className={cn("text-center w-8 h-8 leading-8 rounded-md", isToday(date) ? cn(bgColor, "text-white") : color)}
      >
        {date.getDate()}
      </div>
      {/* {holiday && <div>{holiday.name}</div>} */}
    </div>
  );
};
