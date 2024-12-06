import { google } from "googleapis";

const scope = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];
const jwt = new google.auth.JWT(
  undefined,
  "secrets/key.json",
  undefined,
  scope
);
const calendar = google.calendar("v3");

export const getCalendarEvents = async (calendarId: string) => {
  try {
    await jwt.authorize();

    const response = await calendar.events.list({
      auth: jwt,
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return undefined;
  }
};
