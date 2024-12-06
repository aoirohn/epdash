import { format } from "date-fns";

export const CalendarHeader = () => {
  const today = new Date();

  return (
    <div className="w-full h-full">
      <div className="h-full relative">
        <div className="absolute left-0 bottom-0 ">
          <span className="text-4xl text-white">{format(today, "MMMM")}</span>
        </div>
        <div className="absolute right-0 bottom-0 ">
          <span className="text-2xl text-white">{format(today, "yyyy")}</span>
        </div>
      </div>
    </div>
  );
};
