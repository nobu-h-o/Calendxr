"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents, updateCalendarEvent } from "@/lib/calendar";
import EventForm from "./event-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getCalendarEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    }
    fetchEvents();
  }, []);

  const handleEventChange = async (changeInfo: any) => {
    try {
      const { event, oldEvent } = changeInfo;
      
      // Log the before and after dates to debug the day shift
      console.log("Event change details:", {
        before: {
          start: oldEvent.start,
          end: oldEvent.end,
          allDay: oldEvent.allDay,
        },
        after: {
          start: event.start,
          end: event.end,
          allDay: event.allDay,
        },
        delta: {
          days: changeInfo.delta?.days,
          milliseconds: changeInfo.delta?.milliseconds,
        }
      });
      
      // Extract the Google Calendar ID and event ID
      const calendarId = event.extendedProps?.calendarId || 'primary'; 
      const eventId = event.id;
      
      // Store the local timezone
      const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Create an update object that exactly matches Google Calendar API format
      let updateData: any = {
        summary: event.title
      };
      
      // Handle event dates based on whether it's an all-day event or a timed event
      if (event.allDay) {
        // For all-day events, use YYYY-MM-DD format without timezone conversion
        // This fixes the day shift issue for all-day events
        const startDate = new Date(event.start);
        
        // Format date as YYYY-MM-DD, ensuring we're using local date
        const startDateStr = startDate.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
        updateData.start = { date: startDateStr };
        
        // For all-day events, end date must be the day after (exclusive end date)
        let endDate;
        if (event.end) {
          endDate = new Date(event.end);
        } else {
          // If no end date, use start date + 1 day
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
        }
        
        // Format end date as YYYY-MM-DD
        const endDateStr = endDate.toLocaleDateString('en-CA');
        updateData.end = { date: endDateStr };
      } else {
        // For timed events, preserve the original timezone info if available
        const eventTimezone = event.extendedProps?.timeZone || localTimezone;
        
        if (event.start) {
          updateData.start = {
            dateTime: event.start.toISOString(),
            timeZone: eventTimezone
          };
        }
        
        if (event.end) {
          updateData.end = {
            dateTime: event.end.toISOString(),
            timeZone: eventTimezone
          };
        } else if (event.start) {
          // If no end time, default to start time + 1 hour
          const endTime = new Date(event.start);
          endTime.setHours(endTime.getHours() + 1);
          updateData.end = {
            dateTime: endTime.toISOString(),
            timeZone: eventTimezone
          };
        }
      }
      
      console.log("Sending update data to API:", JSON.stringify(updateData, null, 2));
      
      // Call the update function
      await updateCalendarEvent(calendarId, eventId, updateData);
      
      // Refresh events after update
      const updatedEvents = await getCalendarEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error updating event:", error);
      // Revert the change in the UI
      changeInfo.revert?.();
    }
  };

  return (
    <div>
      <FullCalendar
        height="85vh"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        editable={true}
        selectable={true} 
        selectMirror={true}
        dayMaxEvents={true}
        timeZone="local" // Set FullCalendar to use local timezone
        customButtons={{
          myCustomButton: {
            click: function () {
              setIsFormOpen(true);
            },
            icon: "plus-lg",
          },
        }}
        headerToolbar={{
          left: "prev,next myCustomButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        initialView="dayGridMonth"
        events={events}
        eventChange={handleEventChange}
      />
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[500px] max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;