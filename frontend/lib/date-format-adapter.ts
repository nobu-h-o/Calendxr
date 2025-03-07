export function formatDateForEventForm(dateString: string): Date {
    // Try to parse the date
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date format: ${dateString}`);
      return new Date(); // Return current date as fallback
    }
    
    return date;
  }
  
  /**
   * Converts OCR-extracted event data to the format expected by your event form
   */
  export function formatEventDataForForm(eventData: any): any {
    // Handle case where data may already be in the correct format
    if (eventData.start instanceof Date && eventData.end instanceof Date) {
      return eventData;
    }
    
    try {
      const formattedEvent = {
        id: eventData.id || null,
        title: eventData.title || '',
        description: eventData.description || '',
        
        // Convert string dates to Date objects
        start: typeof eventData.start === 'string' 
          ? formatDateForEventForm(eventData.start)
          : eventData.start,
          
        end: typeof eventData.end === 'string'
          ? formatDateForEventForm(eventData.end)
          : eventData.end,
          
        // Set sensible defaults for other properties
        allDay: eventData.allDay || false,
        calendarId: eventData.calendarId || 'primary'
      };
      
      // Determine if the event should be all-day based on time components
      // If both start and end are at midnight, it's likely an all-day event
      if (formattedEvent.start instanceof Date && formattedEvent.end instanceof Date) {
        const startHasNoTime = formattedEvent.start.getHours() === 0 && 
                               formattedEvent.start.getMinutes() === 0 &&
                               formattedEvent.start.getSeconds() === 0;
                               
        const endHasNoTime = formattedEvent.end.getHours() === 0 && 
                             formattedEvent.end.getMinutes() === 0 &&
                             formattedEvent.end.getSeconds() === 0;
                             
        if (startHasNoTime && endHasNoTime) {
          formattedEvent.allDay = true;
        }
      }
      
      // Check if the event spans a full day or multiple days
      if (formattedEvent.start instanceof Date && formattedEvent.end instanceof Date) {
        const msDiff = formattedEvent.end.getTime() - formattedEvent.start.getTime();
        const hoursDiff = msDiff / (1000 * 60 * 60);
        
        // If it's a 24-hour event (common for all-day events)
        if (hoursDiff === 24) {
          formattedEvent.allDay = true;
        }
      }
      
      return formattedEvent;
    } catch (error) {
      console.error("Error formatting event data:", error);
      return eventData; // Return original data if there's an error
    }
  }