"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isAfter, isSameDay, addHours } from "date-fns";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { CalendarIcon, Trash2, ScanLine, X } from "lucide-react";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { sendOcrImage } from "@/app/api/vision/ocr/route";
import { getChatGPTResponse } from "@/app/api/vision/openai/route";

// Create a schema with dynamic validation for end time
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  location: z.string().optional(),
  allDay: z.boolean().default(false),
  startDate: z.date(),
  startTime: z.string().optional(),
  endDate: z.date(),
  endTime: z.string().optional(),
}).refine((data) => {
  // Skip validation for all-day events, just ensure end date is not before start date
  if (data.allDay) {
    return isAfter(data.endDate, data.startDate) || isSameDay(data.endDate, data.startDate);
  }
  
  // For timed events, check if end is after start
  const [startHours, startMinutes] = (data.startTime || "00:00").split(":").map(Number);
  const [endHours, endMinutes] = (data.endTime || "00:00").split(":").map(Number);
  
  const startDateTime = new Date(data.startDate);
  startDateTime.setHours(startHours, startMinutes, 0, 0);
  
  const endDateTime = new Date(data.endDate);
  endDateTime.setHours(endHours, endMinutes, 0, 0);
  
  return isAfter(endDateTime, startDateTime);
}, {
  message: "End time must be after start time",
  path: ["endTime"] // Show error on the end time field
});

interface EventFormProps {
  event?: any;
  onClose?: () => void;
  onFormSubmit?: (values: any) => void;
  onDelete?: (calendarId: string, eventId: string) => void;
  disabled?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  onClose, 
  onFormSubmit,
  onDelete,
  disabled = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // OCR State
  const [ocrPanelOpen, setOcrPanelOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  
  // Initialize form with default values or event data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      allDay: false,
      startDate: new Date(),
      startTime: "09:00",
      endDate: new Date(),
      endTime: "10:00",
    },
    mode: "onChange" // Validate on change to provide immediate feedback
  });
  
  // Update form when event is provided (edit mode)
  useEffect(() => {
    if (event) {
      const startDate = event.start || new Date();
      const endDate = event.end || new Date(startDate);
      
      // Format times for the form
      const startTime = event.allDay 
        ? "00:00" 
        : format(startDate, "HH:mm");
        
      const endTime = event.allDay 
        ? "23:59" 
        : format(endDate, "HH:mm");
        
      form.reset({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        allDay: event.allDay || false,
        startDate,
        startTime,
        endDate,
        endTime,
      });
    }
  }, [event, form]);
  
  // Auto-adjust end time when start time or date changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Skip if we're not fully initialized yet
      if (!value.startDate || !value.endDate) return;
      
      // If all-day, just make sure end date is not before start date
      if (value.allDay) {
        if (isAfter(value.startDate, value.endDate)) {
          form.setValue('endDate', value.startDate);
        }
        return;
      }
      
      // Handle changes to start time or date
      if (name === 'startTime' || name === 'startDate') {
        const [startHours, startMinutes] = (value.startTime || "00:00").split(":").map(Number);
        const [endHours, endMinutes] = (value.endTime || "00:00").split(":").map(Number);
        
        const startDateTime = new Date(value.startDate);
        startDateTime.setHours(startHours, startMinutes, 0, 0);
        
        const endDateTime = new Date(value.endDate);
        endDateTime.setHours(endHours, endMinutes, 0, 0);
        
        // If end time is no longer after start time, adjust it
        if (!isAfter(endDateTime, startDateTime)) {
          // If same day, set end time 1 hour after start time
          if (isSameDay(value.startDate, value.endDate)) {
            const newEndTime = new Date(startDateTime);
            newEndTime.setHours(newEndTime.getHours() + 1);
            form.setValue('endTime', format(newEndTime, 'HH:mm'));
          } else {
            // If different days, just set the end date to match start date
            // and end time 1 hour after start time
            form.setValue('endDate', value.startDate);
            const newEndTime = new Date(startDateTime);
            newEndTime.setHours(newEndTime.getHours() + 1);
            form.setValue('endTime', format(newEndTime, 'HH:mm'));
          }
        }
      }
      
      // When end date changes, make sure it's valid with current times
      if (name === 'endDate' && isSameDay(value.startDate, value.endDate)) {
        const [startHours, startMinutes] = (value.startTime || "00:00").split(":").map(Number);
        const [endHours, endMinutes] = (value.endTime || "00:00").split(":").map(Number);
        
        // If end time is before start time on the same day, adjust it
        if (
          startHours > endHours || 
          (startHours === endHours && startMinutes >= endMinutes)
        ) {
          const newStartDateTime = new Date(value.startDate);
          newStartDateTime.setHours(startHours, startMinutes, 0, 0);
          
          const newEndTime = addHours(newStartDateTime, 1);
          form.setValue('endTime', format(newEndTime, 'HH:mm'));
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form values:", values);
      
      // Prepare dates based on all-day setting
      let startDateTime, endDateTime;
      
      if (values.allDay) {
        // All-day events use date only
        startDateTime = values.startDate;
        
        // For all-day events, end date should be the next day for Google Calendar
        endDateTime = new Date(values.endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
      } else {
        // Timed events combine date and time
        const [startHours, startMinutes] = values.startTime?.split(":") || ["0", "0"];
        const [endHours, endMinutes] = values.endTime?.split(":") || ["0", "0"];
        
        startDateTime = new Date(values.startDate);
        startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
        
        endDateTime = new Date(values.endDate);
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      }
      
      // Format event data for Google Calendar API
      const eventData: any = {
        summary: values.title,
        description: values.description,
        location: values.location,
      };
      
      // Add date information in the correct format
      if (values.allDay) {
        eventData.start = { 
          date: format(startDateTime, "yyyy-MM-dd") 
        };
        eventData.end = { 
          date: format(endDateTime, "yyyy-MM-dd") 
        };
      } else {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        eventData.start = { 
          dateTime: startDateTime.toISOString(),
          timeZone
        };
        eventData.end = { 
          dateTime: endDateTime.toISOString(),
          timeZone
        };
      }
      
      // Send the formatted data to the parent component
      if (onFormSubmit) {
        onFormSubmit(eventData);
      }
      
    } catch (error) {
      console.error("Error preparing event data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!event?.id) return;
    
    setIsDeleting(true);
    try {
      const calendarId = event.calendarId || 'primary';
      
      // Use the onDelete callback provided by the parent component
      if (onDelete) {
        onDelete(calendarId, event.id);
      }
      
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // OCR functions
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleOcrSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) return;
    
    setIsProcessingOcr(true);

    try {
      const result = await sendOcrImage(image);

      if (result.text) {
        setExtractedText(result.text);
        try {
          const aiResult = await getChatGPTResponse(result.text);
          setAiResponse(aiResult);
          
          // Parse AI response to populate form fields
          try {
            const parsedEvent = JSON.parse(aiResult);
            
            // Only update fields if they contain data
            if (parsedEvent.title) {
              form.setValue('title', parsedEvent.title);
            }
            
            if (parsedEvent.description) {
              form.setValue('description', parsedEvent.description);
            }
            
            if (parsedEvent.location) {
              form.setValue('location', parsedEvent.location);
            }
            
            // Handle date and time
            if (parsedEvent.startDate) {
              const startDate = new Date(parsedEvent.startDate);
              if (!isNaN(startDate.getTime())) {
                form.setValue('startDate', startDate);
                
                // Set start time if available
                if (parsedEvent.startTime) {
                  form.setValue('startTime', parsedEvent.startTime);
                }
              }
            }
            
            if (parsedEvent.endDate) {
              const endDate = new Date(parsedEvent.endDate);
              if (!isNaN(endDate.getTime())) {
                form.setValue('endDate', endDate);
                
                // Set end time if available
                if (parsedEvent.endTime) {
                  form.setValue('endTime', parsedEvent.endTime);
                }
              }
            }
            
            // Set all-day flag if specified
            if (parsedEvent.allDay !== undefined) {
              form.setValue('allDay', parsedEvent.allDay);
            }
          } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
          }
        } catch (aiError) {
          console.error("Error getting AI response:", aiError);
          setAiResponse("Failed to process the request.");
        }
      } else {
        setExtractedText("Failed to extract text.");
      }
    } catch (ocrError) {
      console.error("OCR processing error:", ocrError);
      setExtractedText("Error processing image.");
    } finally {
      setIsProcessingOcr(false);
    }
  };
  
  // Watch for all-day status to apply consistent spacing
  const isAllDay = form.watch("allDay");
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <FormLabel className="font-normal">All Day Event</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Date and Time Row - START */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Start</div>
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button 
                            variant="outline" 
                            className="w-full pl-3 text-left font-normal h-10"
                            disabled={disabled}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={disabled}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Start Time or Spacer */}
              <div>
                {!isAllDay ? (
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="h-10"
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  // Empty div to maintain layout when time is hidden
                  <div className="h-10"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Date and Time Row - END */}
          <div className="space-y-2">
            <div className="text-sm font-medium">End</div>
            <div className="grid grid-cols-2 gap-4">
              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button 
                            variant="outline" 
                            className="w-full pl-3 text-left font-normal h-10"
                            disabled={disabled}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => 
                            isAfter(new Date(form.getValues().startDate), date) || disabled
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* End Time or Spacer */}
              <div>
                {!isAllDay ? (
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="h-10"
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  // Empty div to maintain layout when time is hidden
                  <div className="h-10"></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-6">
            {/* Delete button (only shown when editing) */}
            {event?.id && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || isDeleting || disabled}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            
            {/* OCR Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOcrPanelOpen(true)}
              disabled={isSubmitting || isDeleting || disabled}
              className="flex items-center"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Event
            </Button>
            
            {/* Save/Cancel buttons */}
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting || isDeleting || disabled}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || isDeleting || disabled}
              >
                {isSubmitting ? "Saving..." : event?.id ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* OCR Panel - Rendered conditionally based on ocrPanelOpen state */}
      {ocrPanelOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOcrPanelOpen(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl overflow-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Scan Event Details</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOcrPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleOcrSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload an image of your event invitation, flyer, or details to automatically fill in the form.
                  </p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="mb-2"
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!image || isProcessingOcr}
                  >
                    {isProcessingOcr ? "Processing..." : "Scan Image"}
                  </Button>
                </div>
              </form>

              {extractedText && (
                <div className="mt-4 p-3 bg-gray-50 rounded border">
                  <h3 className="text-sm font-medium mb-1">Extracted Text</h3>
                  <p className="text-xs text-gray-700 whitespace-pre-line">{extractedText}</p>
                </div>
              )}

              {aiResponse && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-1">Analyzed Event Details</h3>
                  <div className="p-3 bg-gray-50 rounded border">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                      {typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse, null, 2)}
                    </pre>
                  </div>
                  <Button
                    type="button"
                    className="w-full mt-4"
                    onClick={() => setOcrPanelOpen(false)}
                  >
                    Apply & Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventForm;