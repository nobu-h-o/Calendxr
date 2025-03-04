"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "@/lib/calendar";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedData = await getCalendarEvents();
        // Assume the Google Calendar API returns an object with an "items" array.
        const items = fetchedData.items ? fetchedData.items : fetchedData;
        const transformedEvents = items.map((event: any) => ({
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        }));
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching Google Calendar events", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <FullCalendar
      height="85vh"
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default Calendar;