"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "@/lib/calendar";
import EventForm from "./event-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

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

  return (
    <div>
      <FullCalendar
        height="85vh"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
        ]}
        editable={true}
        selectable={true} // Allow dates to be selectable.
        selectMirror={true} // Mirror selections visually.
        dayMaxEvents={true}
        customButtons={{
          myCustomButton: {
            click: function () {
              setIsFormOpen(true);
            },
            icon: "plus-lg",
          },
        }}
        headerToolbar={{
          left: "prev,next today myCustomButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        initialView="dayGridMonth"
        events={events}
        themeSystem="bootstrap5"
      />
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[500px] max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>イベントを追加</DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
