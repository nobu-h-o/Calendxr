"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents, updateCalendarEvent, createCalendarEvent, deleteCalendarEvent } from "@/lib/calendar";
import EventForm from "./event-form";
import { calendarStyles } from "./calendarStyles";

// Single interface for all event handling
interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end?: Date | null;
  allDay: boolean;
  calendarId: string;
  // Optional fields for our internal use
  isSingleDay?: boolean;
  displayEnd?: Date | null;
  originalEnd?: Date | null;
}

interface SelectionInfo {
  start: Date;
  end: Date;
  allDay: boolean;
  view: {
    type: string;
  };
  jsEvent?: MouseEvent | null;
  revert?: () => void;
}

// Use the types that match FullCalendar's EventChangeArg
interface EventChangeArg {
  event: {
    id: string;
    title: string;
    start: Date | null;
    end: Date | null;
    allDay: boolean;
    extendedProps?: {
      description?: string;
      location?: string;
      calendarId?: string;
    };
  };
  oldEvent: {
    id: string;
    title: string;
  };
  revert?: () => void;
}

interface FormValues {
  summary?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
  };
  [key: string]: unknown;
}

// Style to prevent horizontal scrolling
const preventOverflowStyle = {
  overflowX: "hidden" as const,
  maxWidth: "100%" as const,
  boxSizing: "border-box" as const
};

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeSelection, setActiveSelection] = useState<SelectionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch events from Google Calendar
  const fetchEvents = async (): Promise<void> => {
    try {
      const fetchedEvents = await getCalendarEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events", error);
      setError("Failed to fetch events. Please try again.");
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
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
  const clearSelection = (): void => {
    if (isNewEvent && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect();
      setIsNewEvent(false);
      setActiveSelection(null);
    }
  };

  // We don't use this function anymore, removing it
  /* const handleDialogChange = (open: boolean): void => {
    setIsFormOpen(open);
    if (!open && !isSyncing) {
      clearSelection();
      setSelectedEvent(null);
    }
  }; */

  const handleEventClick = async (clickInfo: { 
    event: { 
      id: string; 
      title: string; 
      start: Date | null; 
      end: Date | null; 
      allDay: boolean; 
      extendedProps?: Record<string, unknown> 
    } 
  }): Promise<void> => {
    await fetchEvents();
    const event = clickInfo.event;
    
    // Ensure start date is not null (required by our interface)
    if (!event.start) {
      setError("Cannot open event: Missing start date");
      return;
    }
    
    // Adjust end date for all-day events to show the actual last day (not the exclusive end date)
    let adjustedEnd = event.end;
    
    if (event.allDay && event.end) {
      // For all-day events, the API end date is exclusive (day after the event ends)
      // Subtract one day to get the actual end date for display
      adjustedEnd = new Date(event.end);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
    }
    
    // Directly set the selected event without an intermediate variable
    setSelectedEvent({
      id: event.id,
      title: event.title,
      description: String(event.extendedProps?.description || ''),
      location: String(event.extendedProps?.location || ''),
      start: event.start,
      end: adjustedEnd,
      displayEnd: adjustedEnd, 
      originalEnd: event.end,
      allDay: event.allDay,
      calendarId: String(event.extendedProps?.calendarId || 'primary'),
      isSingleDay: Boolean(
        event.allDay && 
        adjustedEnd && 
        event.start.toDateString() === adjustedEnd.toDateString()
      )
    });
    
    setIsNewEvent(false);
    setActiveSelection(null);
    setIsFormOpen(true);
  };

  // Handle date range selections
  const handleDateSelect = (selectInfo: SelectionInfo): void => {
    setActiveSelection(selectInfo);
    
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;
    const allDay = selectInfo.allDay;
    const view = selectInfo.view.type;
    
    // For month view, a day selection's end date is 00:00 the next day
    // If it's a "true" single day selection, adjust so it feels like a single day
    if (view.includes('month') &&
        (endDate.getTime() - startDate.getTime() === 24 * 60 * 60 * 1000) &&
        allDay) {
        // Directly set the selected event
        setSelectedEvent({
          title: '',
          start: startDate,
          end: startDate, // same as start for display
          allDay: true,
          calendarId: 'primary',
          isSingleDay: true
        });
        
        setIsNewEvent(true);
        setIsFormOpen(true);
        return;
    }
    
    // For multi-day all-day selections, adjust end date for display (subtract one day)
    let displayEnd = endDate;
    if (allDay && (endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000)) {
        displayEnd = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Directly set the selected event
    setSelectedEvent({
      title: '',
      start: startDate,
      end: displayEnd,
      allDay: allDay,
      calendarId: 'primary',
    });
    
    setIsNewEvent(true);
    setIsFormOpen(true);
  };
  
  // Handle date clicks (for creating single-day events)
  const handleDateClick = (info: { date: Date; view: { type: string } }): void => {
    // Only handle this for month view to avoid conflicting with time slot clicks
    if (info.view.type === 'dayGridMonth') {
      const clickedDate = info.date;
      
      // Directly set the selected event
      setSelectedEvent({
        title: '',
        start: clickedDate,
        end: clickedDate, // Use the SAME date for start and end in the UI
        allDay: true,
        calendarId: 'primary',
        isSingleDay: true // Flag to identify true single-day events
      });
      
      setIsNewEvent(true);
      setIsFormOpen(true);
    }
  };

  const handleEventChange = async (changeInfo: EventChangeArg): Promise<void> => {
    try {
      setIsSyncing(true);
      const { event } = changeInfo;
      
      const calendarId = event.extendedProps?.calendarId || 'primary'; 
      const eventId = event.id;
      
      const updateData: Record<string, unknown> = {
        summary: event.title
      };
      
      if (event.allDay) {
        if (!event.start) {
          throw new Error("Event start date is required");
        }
        
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
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please check on Google Calendar.");
      if (changeInfo.revert) {
        changeInfo.revert();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Handler for form submission (create or update)
  const handleFormSubmitAndSuccess = async (formValues: FormValues): Promise<void> => {
    if (!formValues) {
      setError("No form values provided");
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
        const endDate = new Date(formValues.end.date as string);
        
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
  const handleEventDelete = async (calendarId: string, eventId: string): Promise<void> => {
    if (!eventId) {
      setError("Cannot delete event: No ID provided");
      return;
    }
  
    try {
      setIsSyncing(true);
      
      // Close the form
      setIsFormOpen(false);
      
      // Delete the event
      await deleteCalendarEvent(calendarId, eventId);
      
      // Refresh events
      await fetchEvents();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to delete event: ${errorMessage}`);
      setIsFormOpen(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFormClose = (): void => {
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
          // The select method only expects start and end dates
          // The allDay property should be set using selectAllDay option
          calendarApi.select(
            activeSelection.start,
            activeSelection.end
          );
        }
      }
    }
  }, [events, isFormOpen, isNewEvent, activeSelection, isSyncing]);

  // Update the "add" button to ensure it's styled properly
  useEffect(() => {
    const updateButtonStyles = (): void => {
      const btn = document.querySelector('.fc-myCustomButton-button');
      if (btn) {
        // Use a thicker plus icon with adjusted viewBox and stroke-width
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="plus-icon" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" stroke-width="2.5"></line>
            <line x1="5" y1="12" x2="19" y2="12" stroke-width="2.5"></line>
          </svg>
        `;
        
        // Add CSS to ensure the stroke appears thicker
        const styleEl = document.createElement('style');
        styleEl.textContent = `
          .plus-icon line {
            stroke-width: 2.5px !important;
          }
          .fc-myCustomButton-button {
            padding: 2px !important;
          }
        `;
        document.head.appendChild(styleEl);
      }
    };
    
    // Run immediately and also after a short delay to ensure the calendar has fully rendered
    updateButtonStyles();
    const timer = setTimeout(updateButtonStyles, 100);
    
    return () => {
      clearTimeout(timer);
      // Remove any added styles when component unmounts
      const styleEl = document.querySelector('style:last-child');
      if (styleEl && styleEl.textContent && styleEl.textContent.includes('.plus-icon')) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  return (
    <div className="relative flex w-full overflow-x-hidden" style={preventOverflowStyle}>
      {/* Calendar takes the full width */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden" style={preventOverflowStyle}>
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
            click: function() {
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
            text: "Add",
          },
        }}
        headerToolbar={{
          left: "prev,next myCustomButton",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end || undefined, // Convert null to undefined
          allDay: event.allDay,
          extendedProps: {
            description: event.description,
            location: event.location,
            calendarId: event.calendarId
          }
        }))}
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
                {selectedEvent?.id ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button 
                onClick={handleFormClose}
                className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                disabled={isSyncing}
                aria-label="Close form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center" role="alert">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white opacity-80 hover:opacity-100"
            aria-label="Dismiss error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;