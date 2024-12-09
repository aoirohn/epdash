import type { calendar_v3 } from "googleapis";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/utils/tailwind-merge";
import { CalendarDays } from "./calendar-days";
import { CalendarHeader } from "./calendar-header";

type CalendarProps = {
  holidaysData?: calendar_v3.Schema$Event[];
  eventsData?: calendar_v3.Schema$Event[];
  className?: ClassNameValue;
};

export const Calendar = ({ holidaysData, eventsData, className }: CalendarProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center h-full gap-2", className)}>
      <div className="w-full h-[64px] ">
        <CalendarHeader />
      </div>
      <div className="w-full  flex-grow ">
        <CalendarDays holidaysData={holidaysData} eventsData={eventsData} />
      </div>
    </div>
  );
};
