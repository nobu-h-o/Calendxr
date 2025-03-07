export const calendarStyles = `
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
  max-width: 100%;
  overflow-x: hidden;
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

/* Fix popover width issues */
.fc-popover {
  max-width: 300px;
  overflow-x: hidden;
}

.fc-popover-header {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Fix any potential overflow from event titles */
.fc-event-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Fix calendar container width issues */
.fc-view-harness {
  max-width: 100%;
  overflow-x: hidden;
}

.fc-scroller {
  overflow: hidden !important;
}

/* Only show scrollbars when necessary */
.fc-scroller-liquid-absolute {
  overflow: visible !important;
}

/* Fix various sizing issues */
.fc-view-harness {
  height: auto !important;
}

.fc .fc-view {
  overflow: visible;
}

/* Ensure proper sizing for the calendar container */
.fc-view-harness-active {
  height: auto !important;
  min-height: 600px;
}

/* Make sure the day view doesn't cause unwanted scrolling */
.fc-timegrid-slots table {
  height: auto !important;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  /* Adjust header toolbar for mobile */
  .fc .fc-header-toolbar {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem !important;
    padding: 0;
  }
  
  .fc .fc-header-toolbar .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  /* Center title */
  .fc .fc-toolbar-title {
    font-size: 1.25rem;
    text-align: center;
  }
  
  /* Adjust button sizes for better touch targets */
  .fc .fc-button {
    min-width: 40px;
    height: 40px;
    padding: 0 8px;
    font-size: 0.85rem;
    margin: 0 2px;
  }
  
  /* Adjust day cell sizing */
  .fc .fc-daygrid-day {
    min-height: 3.5rem;
  }
  
  /* Make event text more readable on small screens */
  .fc-event {
    font-size: 0.75rem !important;
  }
  
  /* Smaller day numbers on mobile */
  .fc .fc-daygrid-day-number {
    font-size: 0.8rem;
  }
  
  /* Adjust popover for touch screens */
  .fc-popover {
    max-width: 85vw;
  }
  
  /* Week view adjustments */
  .fc-timeGridWeek-view .fc-col-header-cell {
    padding: 4px 0;
    font-size: 0.7rem;
  }
  
  /* Day view adjustments */
  .fc-timeGridDay-view .fc-timegrid-slot {
    height: 3rem;
  }

  /* Improve vertical rhythm */
  .fc .fc-toolbar-chunk:nth-child(2) {
    order: -1;
    margin-bottom: 0.5rem;
  }

  /* Button group layout */
  .fc .fc-button-group {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  
  /* Previous/next and view buttons should be full width */
  .fc .fc-button-group .fc-button {
    flex: 1;
  }
  
  /* Adjust footer toolbar for better mobile experience */
  .fc-footer-toolbar {
    margin-top: 1rem !important;
  }
  
  /* Limit visible events on mobile to prevent overflow */
  .fc-daygrid-more-link {
    font-size: 0.7rem;
    font-weight: 500;
    padding: 1px 3px;
    margin-top: 2px;
  }
  
  /* Ensure the "add" button is properly visible and sized on mobile */
  .fc .fc-myCustomButton-button {
    width: 40px;
    height: 40px;
  }
  
  /* Adjust time grid hours column width on mobile */
  .fc .fc-timegrid-axis {
    width: 35px !important;
  }
  
  /* Fix week view cells on mobile to be more readable */
  .fc .fc-timeGridWeek-view .fc-col-header-cell-cushion {
    font-size: 0.7rem;
    white-space: normal;
    display: block;
  }
  
  /* Reduce min height on mobile for better fit on smaller screens */
  .fc-view-harness-active {
    min-height: 400px !important;
  }
  
  /* Ensure event form takes full width on mobile */
  .event-form-panel {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Make calendar fit better on small screens */
  .fc {
    font-size: 0.9rem;
  }
  
  /* Improve event tooltips/popovers on mobile */
  .fc-event-tooltip, .fc-popover-body {
    font-size: 0.8rem;
  }
}
`;