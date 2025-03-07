"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getCalendarEvents,
  updateCalendarEvent,
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/calendar";
import EventForm from "./event-form";
import { calendarStyles } from "./calendarStyles";

// Style to prevent horizontal scrolling
const preventOverflowStyle = {
  overflowX: "hidden" as const,
  maxWidth: "100%" as const,
  boxSizing: "border-box" as const
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<any>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSelection, setActiveSelection] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState(false);

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
    
    // Add the custom styles to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = calendarStyles;
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
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

  const handleEventClick = async (clickInfo: any) => {
    await fetchEvents();
    const event = clickInfo.event;
    
    // Adjust end date for all-day events to show the actual last day (not the exclusive end date)
    let adjustedEnd = event.end;
    
    if (event.allDay && event.end) {
      // For all-day events, the API end date is exclusive (day after the event ends)
      // Subtract one day to get the actual end date for display
      adjustedEnd = new Date(event.end);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
    }
    
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.extendedProps?.description || "",
      location: event.extendedProps?.location || "",
      start: event.start,
      end: adjustedEnd, // Use adjusted end date
      displayEnd: adjustedEnd, // Keep track of display end date
      originalEnd: event.end, // Keep original end date for API
      allDay: event.allDay,
      calendarId: event.extendedProps?.calendarId || 'primary',
      isSingleDay: event.allDay && 
        event.start && adjustedEnd && 
        event.start.toDateString() === adjustedEnd.toDateString() // Flag if it's a single-day event
    };

    console.log("Opening event for editing:", formattedEvent);

    setSelectedEvent(formattedEvent);
    setIsNewEvent(false);
    setActiveSelection(null);

    setIsFormOpen(true);
  };

  // Handle date range selections
  const handleDateSelect = (selectInfo: any) => {
    setActiveSelection(selectInfo);
    
    let startDate = selectInfo.start;
    let endDate = selectInfo.end;
    const allDay = selectInfo.allDay;
    const view = selectInfo.view.type;
    
    // For month view, a day selection's end date is 00:00 the next day
    // If it's a "true" single day selection, adjust so it feels like a single day
    if (view.includes('month') &&
        (endDate.getTime() - startDate.getTime() === 24 * 60 * 60 * 1000) &&
        allDay) {
        const singleDayEvent = {
          title: '',
          start: startDate,
          end: startDate, // same as start for display
          allDay: true,
          calendarId: 'primary',
          isSingleDay: true
        };
        
        setSelectedEvent(singleDayEvent);
        setIsNewEvent(true);
        setIsFormOpen(true);
        return;
    }
    
    // For multi-day all-day selections, adjust end date for display (subtract one day)
    let displayEnd = endDate;
    if (allDay && (endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000)) {
        displayEnd = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // For non-single day selections or timed events
    const newEvent = {
      title: '',
      start: startDate,
      end: displayEnd,
      allDay: allDay,
      calendarId: 'primary',
    };

    console.log("Selected date range:", {
      start: startDate,
      end: displayEnd,
      allDay: allDay,
      view: view,
    });

    setSelectedEvent(newEvent);
    setIsNewEvent(true);
    setIsFormOpen(true);
  };
  
  // Handle date clicks (for creating single-day events)
  const handleDateClick = (info: any) => {
    // Only handle this for month view to avoid conflicting with time slot clicks
    if (info.view.type === 'dayGridMonth') {
      const clickedDate = info.date;
      
      // Create a single-day event with the same start and end date
      // For a single-day event, the display should show just one day
      // When saving, we'll adjust to API format (exclusive end date)
      const singleDayEvent = {
        title: '',
        start: clickedDate,
        end: clickedDate, // Use the SAME date for start and end in the UI
        allDay: true,
        calendarId: 'primary',
        isSingleDay: true // Flag to identify true single-day events
      };
      
      console.log("Creating single-day event:", {
        date: clickedDate,
        isSingleDay: true
      });
      
      setSelectedEvent(singleDayEvent);
      setIsNewEvent(true);
      setIsFormOpen(true);
    }
  };

  const handleEventChange = async (changeInfo: any) => {
    try {
      setIsSyncing(true);
      const { event, oldEvent } = changeInfo;

      const calendarId = event.extendedProps?.calendarId || "primary";
      const eventId = event.id;

      const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      let updateData: any = {
        summary: event.title,
      };

      if (event.allDay) {
        const startDate = new Date(event.start);

        const startDateStr = startDate.toLocaleDateString("en-CA");
        updateData.start = { date: startDateStr };

        let endDate;
        if (event.end) {
          endDate = new Date(event.end);
        } else {
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
        }

        const endDateStr = endDate.toLocaleDateString("en-CA");
        updateData.end = { date: endDateStr };
      } else {
        const toLocalISOString = (date: Date): string => {
          const pad = (num: number) => String(num).padStart(2, '0');
          const year = date.getFullYear();
          const month = pad(date.getMonth() + 1);
          const day = pad(date.getDate());
          const hours = pad(date.getHours());
          const minutes = pad(date.getMinutes());
          const seconds = pad(date.getSeconds());
          const offset = -date.getTimezoneOffset();
          const sign = offset >= 0 ? "+" : "-";
          const absOffset = Math.abs(offset);
          const offsetHours = pad(Math.floor(absOffset / 60));
          const offsetMinutes = pad(absOffset % 60);
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
        };
        
        if (event.start) {
          updateData.start = {
            dateTime: toLocalISOString(new Date(event.start))
          };
        }

        if (event.end) {
          updateData.end = {
            dateTime: toLocalISOString(new Date(event.end))
          };
        } else if (event.start) {
          const endTime = new Date(event.start);
          endTime.setHours(endTime.getHours() + 1);
          updateData.end = {
            dateTime: toLocalISOString(endTime)
          };
        }
      }

      await updateCalendarEvent(calendarId, eventId, updateData);
      // await fetchEvents(); // Refresh events after update
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please check on Google Calendar.");
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
      
      // Fix for all-day events, especially single-day events
      if (selectedEvent?.isSingleDay && formValues.start?.date) {
        // For single-day all-day events, we need to make the end date exclusive
        // (the day after the start date) for the Google Calendar API
        
        // Parse the start date
        const startDate = new Date(formValues.start.date);
        
        // Create an end date that's one day after (exclusive end date format)
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        // Format as YYYY-MM-DD
        formValues.end = { 
          date: endDate.toISOString().split('T')[0]
        };
      }
      // For multi-day all-day events, if the end date is displayed as the actual last day,
      // we need to add one day to make it exclusive for the API
      else if (formValues.start?.date && formValues.end?.date) {
        const endDate = new Date(formValues.end.date);
        
        // If not a single-day event or no isSingleDay flag, check if adjustment needed
        if (!selectedEvent?.isSingleDay) {
          // Add a day to make it exclusive
          endDate.setDate(endDate.getDate() + 1);
          formValues.end.date = endDate.toISOString().split('T')[0];
        }
      }

      if (selectedEvent?.id) {
        // Update existing event
        const calendarId = selectedEvent.calendarId || "primary";
        await updateCalendarEvent(calendarId, selectedEvent.id, formValues);
      } else {
        // Create new event
        const calendarId = "primary";
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
      setError("Failed to save event. Please try again.");
      setIsSyncing(false);
    }
  };

  // Handler for event deletion
  const handleEventDelete = async (calendarId: string, eventId: string) => {
    console.log("Deleting event with ID:", eventId, "from calendar:", calendarId);
    
    if (!eventId) {
      console.error("Cannot delete event: No event ID provided");
      setError("Cannot delete event: No ID provided");
      return;
    }
  
    try {
      setIsSyncing(true);

      // Close the form
      setIsFormOpen(false);
      
      try {
        // Delete the event
        await deleteCalendarEvent(calendarId, eventId);
        console.log("Event deleted successfully");
        
        // Refresh events
        await fetchEvents();
      } catch (error: any) {
        console.error("Error in deleteCalendarEvent:", error);
        throw new Error(`Failed to delete event: ${error.message || 'Server error'}`);
      }
      
    } catch (error: any) {
      console.error("Error deleting event:", error);
      setError(`Failed to delete event: ${error.message || 'Unknown error'}`);

      setIsFormOpen(true);
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

        if (!document.querySelector(".fc-highlight")) {
          calendarApi.select(
            activeSelection.start,
            activeSelection.end,
            activeSelection.allDay
          );
        }
      }
    }
  }, [events, isFormOpen, isNewEvent, activeSelection, isSyncing]);

  // Update the "add" button to ensure it's styled properly
  useEffect(() => {
    const updateButtonStyles = () => {
      const btn = document.querySelector('.fc-myCustomButton-button');
      if (btn) {
        // Modern plus icon with thinner lines - Fixed SVG attributes to use React camelCase with larger size
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
      }
    };
    
    // Run immediately and also after a short delay to ensure the calendar has fully rendered
    updateButtonStyles();
    const timer = setTimeout(updateButtonStyles, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex w-full overflow-x-hidden" style={preventOverflowStyle}>
      {/* Calendar takes the full width */}
      <div className="flex-1 rounded-lg shadow-sm overflow-hidden calendar-container" style={{
        ...preventOverflowStyle,
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))"
      }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        height="auto"  // Changed from "85vh" to "auto"
        contentHeight="auto"  // Added to let content determine height
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
              // Create a new event at the current time
              const now = new Date();
              const endTime = new Date(now);
              endTime.setHours(endTime.getHours() + 1);
              
              setSelectedEvent({
                title: '',
                start: now,
                end: endTime,
                allDay: false,
                calendarId: 'primary',
              });
              setIsNewEvent(true);
              setActiveSelection(null);
              setIsFormOpen(true);
            },
            text: "",
          },
        }}
        headerToolbar={{
          left: "prev,next myCustomButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        events={events}
        eventChange={handleEventChange}
        eventClick={handleEventClick}
        select={handleDateSelect}
        dateClick={handleDateClick}
      />
      </div>
      
      {/* Side panel form with fixed width and better overflow control */}
      <div 
        className={`fixed right-0 top-0 bottom-0 transition-transform transform ${isFormOpen ? 'translate-x-0' : 'translate-x-full'} z-40 bg-white border-l border-gray-200 shadow-xl w-[400px] max-w-full overflow-y-auto overflow-x-hidden`}
        style={preventOverflowStyle}
      >
        {isFormOpen && (
          <div className="p-6 w-full max-w-full" style={preventOverflowStyle}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedEvent?.id ? "Edit Event" : "Create New Event"}
              </h2>
              <button 
                onClick={handleFormClose}
                className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                disabled={isSyncing}
              >
                {/* Fixed SVG attributes to use React camelCase */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <EventForm
              event={selectedEvent}
              onClose={handleFormClose}
              onFormSubmit={handleFormSubmitAndSuccess}
              onDelete={handleEventDelete}
              disabled={isSyncing}
            />
          </div>
        )}
      </div>
    
      {/* Error toast with modern styling */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white opacity-80 hover:opacity-100"
          >
            {/* Fixed SVG attributes to use React camelCase */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
