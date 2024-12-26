import { addDays, addMonths, endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { google } from "googleapis";

const scope = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"];
const jwt = new google.auth.JWT(undefined, "secrets/key.json", undefined, scope);
const calendar = google.calendar("v3");

export const getCalendarEvents = async (calendarId: string) => {
  try {
    await jwt.authorize();

    const response = await calendar.events.list({
      auth: jwt,
      calendarId: calendarId,
      timeMin: startOfMonth(subDays(new Date(), 6)).toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return undefined;
  }
};

export const getHolidayEvents = async (calendarId: string) => {
  try {
    await jwt.authorize();

    const response = await calendar.events.list({
      auth: jwt,
      calendarId: calendarId,
      timeMin: startOfMonth(subDays(new Date(), 6)).toISOString(),
      timeMax: addDays(endOfMonth(new Date()), 14).toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items?.filter((event) => event.description === "祝日") || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return undefined;
  }
};
