"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents, updateCalendarEvent, createCalendarEvent, deleteCalendarEvent } from "@/lib/calendar";
import EventForm from "./event-form";

// Modern black and white theme with consistent sizing
const calendarStyles = `
  /* Modern black and white theme */
  :root {
    --fc-border-color: transparent;
    --fc-button-bg-color: #000000;
    --fc-button-border-color: #000000;
    --fc-button-hover-bg-color: #333333;
    --fc-button-hover-border-color: #333333;
    --fc-button-active-bg-color: #333333;
    --fc-event-bg-color: #ffffff;
    --fc-event-border-color: #000000;
    --fc-event-text-color: #000000;
    --fc-today-bg-color: #f9fafb;
    --fc-page-bg-color: #ffffff;
    --fc-neutral-bg-color: #f3f4f6;
    --fc-list-event-hover-bg-color: #f3f4f6;
    --fc-highlight-color: rgba(0, 0, 0, 0.08);
  }

  /* Modern styling */
  .fc {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  /* Remove outer borders, keep inner borders subtle */
  .fc th, .fc td {
    border-color: #f3f4f6;
  }
  
  /* Remove the outer border */
  .fc .fc-scrollgrid {
    border: none !important;
  }
  
  .fc .fc-scrollgrid-section-header th,
  .fc .fc-scrollgrid-section-footer td {
    border-right: none !important;
  }
  
  .fc .fc-scrollgrid-section:last-of-type td {
    border-bottom: none !important;
  }
  
  /* Style all buttons consistently */
  .fc .fc-button {
    min-width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    font-weight: 500;
    text-transform: capitalize;
    border-radius: 6px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  /* Fixed active button styles - no borders */
  .fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: #333333;
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Also ensure no outline when focused */
  .fc .fc-button:focus {
    outline: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  /* Additional style to ensure consistency */
  .fc .fc-button-primary {
    border: 1px solid transparent;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  /* Override hover styles to not show border */
  .fc .fc-button:hover {
    border-color: transparent !important;
  }

  /* Plus button styling */
  .fc .fc-myCustomButton-button {
    width: 40px;
    border-radius: 6px;
    background-color: #000;
  }

  /* Add subtle hover effect */
  .fc .fc-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Style the toolbar better */
  .fc-header-toolbar {
    padding: 0 8px;
    margin-bottom: 16px !important;
  }

  /* Improved day/date styling */
  .fc .fc-daygrid-day-top {
    justify-content: center;
    padding-top: 4px;
  }

  .fc .fc-daygrid-day-number {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* Event styling - different styles for all-day vs timed events */
  /* Base styles for all events */
  .fc-event {
    border-radius: 4px !important;
    padding: 2px 4px !important;
    font-size: 0.85rem !important;
    font-weight: 500;
    border: 1px solid #000 !important;
    transition: transform 0.1s ease;
  }
  
  /* Hover effect for all events */
  .fc-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  /* Timed events (white bg, black border, black text) */
  .fc-timegrid-event,
  .fc-daygrid-dot-event,
  .fc-daygrid-event:not(.fc-daygrid-block-event) {
    background-color: #fff !important;
    color: #000 !important;
  }
  
  /* All-day events (black bg, white text) */
  .fc-daygrid-block-event {
    background-color: #000 !important;
    color: #fff !important;
  }
  
  /* Make sure the title is readable for both event types */
  .fc-daygrid-block-event .fc-event-title,
  .fc-daygrid-block-event .fc-event-time {
    color: #fff !important;
  }
  
  .fc-timegrid-event .fc-event-title,
  .fc-timegrid-event .fc-event-time,
  .fc-daygrid-dot-event .fc-event-title,
  .fc-daygrid-dot-event .fc-event-time {
    color: #000 !important;
  }

  /* Today styling */
  .fc .fc-day-today {
    background-color: #f9fafb !important;
  }
  
  /* Day header row */
  .fc .fc-col-header-cell {
    padding: 8px 0;
    background-color: #f9fafb;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  /* Better selection highlighting */
  .fc .fc-highlight {
    background-color: rgba(0,0,0,0.08);
  }

  /* TimeGrid view improvements */
  .fc .fc-timegrid-slot {
    height: 48px;
  }

  /* Additional list view styling */
  .fc-list-event {
    background-color: #fff !important;
    border-left: 3px solid #000 !important;
  }
  
  .fc-list-event td {
    border-color: #f3f4f6 !important;
  }
  
  .fc-list-event:hover td {
    background-color: #f9fafb !important;
  }
  
  .fc-list-event-dot {
    border-color: #000 !important;
  }
  
  /* For list view events */
  .fc-list-event-title a,
  .fc-list-event-time {
    color: #000 !important;
  }
`;

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<any>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSelection, setActiveSelection] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
      description: event.extendedProps?.description || '',
      location: event.extendedProps?.location || '',
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
      await fetchEvents(); // Refresh events after update
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
      setError("Failed to save event. Please try again.");
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
      setError("Failed to delete event. Please try again.");
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

  // Update the "add" button to ensure it's styled properly
  useEffect(() => {
    const updateButtonStyles = () => {
      const btn = document.querySelector('.fc-myCustomButton-button');
      if (btn) {
        // Modern plus icon with thinner lines
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
      }
    };
    
    // Run immediately and also after a short delay to ensure the calendar has fully rendered
    updateButtonStyles();
    const timer = setTimeout(updateButtonStyles, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex">
      {/* Calendar takes the full width */}
      <div className="flex-1 bg-white rounded-lg shadow-sm">
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
          dateClick={handleDateClick} // Add handler for simple date clicks
        />
      </div>
      
      {/* Side panel form with modern styling */}
      <div className={`fixed right-0 top-0 bottom-0 transition-transform transform ${isFormOpen ? 'translate-x-0' : 'translate-x-full'} z-40 bg-white border-l border-gray-200 shadow-xl w-[400px] overflow-auto`}>
        {isFormOpen && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedEvent?.id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={handleFormClose}
                className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                disabled={isSyncing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;