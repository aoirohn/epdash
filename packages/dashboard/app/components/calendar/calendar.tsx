import { CalendarDays } from "./calendar-days";
import { CalendarHeader } from "./calendar-header";

export const Calendar = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="w-full h-[64px] ">
        <CalendarHeader />
      </div>
      <div className="w-full  flex-grow ">
        <CalendarDays />
      </div>
    </div>
  );
};
