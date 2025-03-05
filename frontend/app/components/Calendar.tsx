"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents, updateCalendarEvent, createCalendarEvent, deleteCalendarEvent } from "@/lib/calendar";
import EventForm from "./event-form";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<any>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSelection, setActiveSelection] = useState<any>(null);

  // Function to fetch events from Google Calendar
  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getCalendarEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const clearSelection = () => {
    if (isNewEvent && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
      setIsNewEvent(false);
      setActiveSelection(null);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open && !isSyncing) {
      clearSelection();
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.extendedProps?.description || '',
      location: event.extendedProps?.location || '',
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      calendarId: event.extendedProps?.calendarId || 'primary',
    };
    
    console.log("Opening event for editing:", formattedEvent);
    
    setSelectedEvent(formattedEvent);
    setIsNewEvent(false);
    setActiveSelection(null);
    
    setIsFormOpen(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    setActiveSelection(selectInfo);
    
    const newEvent = {
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      calendarId: 'primary',
    };
    
    console.log("Selected date range:", {
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      view: selectInfo.view.type,
    });
    
    setSelectedEvent(newEvent);
    setIsNewEvent(true);
    
    setIsFormOpen(true);
  };

  const handleEventChange = async (changeInfo: any) => {
    try {
      setIsSyncing(true);
      const { event, oldEvent } = changeInfo;
      
      const calendarId = event.extendedProps?.calendarId || 'primary'; 
      const eventId = event.id;
      
      const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      let updateData: any = {
        summary: event.title
      };
      
      if (event.allDay) {
        const startDate = new Date(event.start);
        
        const startDateStr = startDate.toLocaleDateString('en-CA');
        updateData.start = { date: startDateStr };
        
        let endDate;
        if (event.end) {
          endDate = new Date(event.end);
        } else {
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
        }
        
        const endDateStr = endDate.toLocaleDateString('en-CA');
        updateData.end = { date: endDateStr };
      } else {
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
          const endTime = new Date(event.start);
          endTime.setHours(endTime.getHours() + 1);
          updateData.end = {
            dateTime: endTime.toISOString(),
            timeZone: eventTimezone
          };
        }
      }
      
      await updateCalendarEvent(calendarId, eventId, updateData);
      await fetchEvents(); // Refresh events
    } catch (error) {
      console.error("Error updating event:", error);
      changeInfo.revert?.();
    } finally {
      setIsSyncing(false);
    }
  };

  // Handler for form submission (create or update)
  const handleFormSubmitAndSuccess = async (formValues: any) => {
    if (!formValues) {
      console.error("No form values provided");
      return;
    }

    try {
      setIsSyncing(true);
      setIsFormOpen(false);

      if (selectedEvent?.id) {
        // Update existing event
        const calendarId = selectedEvent.calendarId || 'primary';
        await updateCalendarEvent(calendarId, selectedEvent.id, formValues);
      } else {
        // Create new event
        const calendarId = 'primary';
        await createCalendarEvent(calendarId, formValues);
      }

      // Refresh events
      await fetchEvents();
      
      // Clear selection after a delay to ensure the event is rendered
      setTimeout(() => {
        clearSelection();
        setIsSyncing(false);
      }, 500);
      
    } catch (error) {
      console.error("Error saving event:", error);
      setIsSyncing(false);
    }
  };

  // Handler for event deletion
  const handleEventDelete = async (calendarId: string, eventId: string) => {
    try {
      setIsSyncing(true);
      
      // Close the form
      setIsFormOpen(false);
      
      // Delete the event
      await deleteCalendarEvent(calendarId, eventId);
      console.log("Event deleted successfully");
      
      // Refresh events
      await fetchEvents();
      
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFormClose = () => {
    if (!isSyncing) {
      setIsFormOpen(false);
      clearSelection();
      setSelectedEvent(null);
    }
  };

  // Recreate selection if needed
  useEffect(() => {
    if (isNewEvent && activeSelection && !isFormOpen && isSyncing) {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        
        if (!document.querySelector('.fc-highlight')) {
          calendarApi.select(
            activeSelection.start,
            activeSelection.end,
            activeSelection.allDay
          );
        }
      }
    }
  }, [events, isFormOpen, isNewEvent, activeSelection, isSyncing]);

  return (
    <div className="relative flex">
      {/* Calendar takes the full width */}
      <div className="flex-1">
        <FullCalendar
          ref={calendarRef}
          height="85vh"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          editable={true}
          selectable={true} 
          selectMirror={true}
          unselectAuto={false}
          selectLongPressDelay={0}
          dayMaxEvents={true}
          timeZone="local"
          customButtons={{
            myCustomButton: {
              click: function () {
                setSelectedEvent(null);
                setIsNewEvent(false);
                setActiveSelection(null);
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
          eventClick={handleEventClick}
          select={handleDateSelect}
        />
      </div>
      
      {/* Side panel form */}
      <div className={`fixed right-0 top-0 bottom-0 transition-transform transform ${isFormOpen ? 'translate-x-0' : 'translate-x-full'} z-40 bg-background border-l border-border shadow-xl w-[400px] overflow-auto`}>
        {isFormOpen && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedEvent?.id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={handleFormClose}
                className="rounded-full p-2 hover:bg-muted text-muted-foreground"
                disabled={isSyncing}
              >
                ✕
              </button>
            </div>
            <EventForm 
              event={selectedEvent} 
              onClose={handleFormClose}
              onFormSubmit={handleFormSubmitAndSuccess}
              onDelete={handleEventDelete} // Add the delete handler
              disabled={isSyncing}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;