"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPin,
  Video,
  Bell,
  User,
  ChevronDown,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function EventForm() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [isAllDay, setIsAllDay] = useState(false);
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    const eventData = {
      summary: title,
      start: isAllDay
        ? { date: startDate.toISOString().split("T")[0] }
        : { dateTime: startDate.toISOString() },
      end: isAllDay
        ? { date: endDate.toISOString().split("T")[0] }
        : { dateTime: endDate.toISOString() }
    };
    try {
      const res = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarId: "primary", eventData })
      });
      const result = await res.json();
      if (res.ok) {
        alert("Event created successfully!");
      } else {
        alert("Failed to create event: " + result.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Event Details</h2>
      </div>
      <div className="p-4 flex-1 overflow-auto">
        {/* Title input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Add title"
            className="text-xl border-0 rounded-none px-0 pb-2 focus:outline-none focus-visible:ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Date and time selectors */}
        <div className="flex flex-wrap gap-2 mb-6">
          <DatePickerWithPresets date={startDate} setDate={setStartDate} />

          {!isAllDay && (
            <>
              <TimePickerSelect
                value={format(startDate, "HH:mm")}
                onChange={(time) => {
                  const [hours, minutes] = time.split(":").map(Number);
                  const newDate = new Date(startDate);
                  newDate.setHours(hours, minutes);
                  setStartDate(newDate);
                }}
              />

              <span className="self-center text-gray-500">to</span>
            </>
          )}

          <DatePickerWithPresets date={endDate} setDate={setEndDate} />

          {!isAllDay && (
            <TimePickerSelect
              value={format(endDate, "HH:mm")}
              onChange={(time) => {
                const [hours, minutes] = time.split(":").map(Number);
                const newDate = new Date(endDate);
                newDate.setHours(hours, minutes);
                setEndDate(newDate);
              }}
            />
          )}

          <Button variant="outline" size="sm" className="ml-2">
            Time zone
          </Button>
        </div>

        {/* All day and repeat */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={isAllDay}
              onCheckedChange={(checked) => setIsAllDay(checked === true)}
            />
            <Label htmlFor="all-day" className="text-sm">
              All day
            </Label>
          </div>

          <Select defaultValue="does-not-repeat">
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Does not repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="does-not-repeat">Does not repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom...</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="border-b rounded-none bg-transparent h-auto p-0 w-full justify-start">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Event details
            </TabsTrigger>
            <TabsTrigger
              value="find-time"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Find a time
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Guests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            {/* Google Meet */}
            <div className="flex items-center gap-2 p-2 mb-4 hover:bg-gray-100 rounded">
              <Video className="text-gray-500 h-5 w-5" />
              <span className="text-gray-500 text-sm">
                Add Google Meet video conferencing
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 p-2 mb-4 hover:bg-gray-100 rounded">
              <MapPin className="text-gray-500 h-5 w-5" />
              <Input
                placeholder="Add location"
                className="border-0 focus-visible:ring-0 p-0 text-sm"
              />
            </div>

            {/* Notification */}
            <div className="flex items-center gap-2 p-2 mb-4">
              <Bell className="text-gray-500 h-5 w-5" />
              <div className="flex items-center gap-2">
                <Select defaultValue="30">
                  <SelectTrigger className="w-[80px] h-8">
                    <SelectValue placeholder="30" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="minutes">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                    <SelectItem value="days">days</SelectItem>
                    <SelectItem value="weeks">weeks</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 pl-2 mb-4"
            >
              <span>Add notification</span>
            </Button>

            {/* User */}
            <div className="flex items-center gap-2 p-2 mb-4">
              <User className="text-gray-500 h-5 w-5" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs">
                    N
                  </div>
                  <span className="text-sm">Nobuhiro Oto</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Busy */}
            <div className="flex items-center gap-2 p-2 mb-4">
              <div className="w-5 h-5" />{" "}
              {/* Spacer to align with icons above */}
              <div className="flex items-center gap-2">
                <Select defaultValue="busy">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Busy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="default">
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Default visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default visibility</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <span className="text-gray-500">?</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visibility settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Description */}
            <div className="border rounded-md mt-4">
              <div className="flex items-center gap-1 p-2 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="h-5 w-px bg-gray-300 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="h-5 w-px bg-gray-300 mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add description"
                className="border-0 rounded-none focus-visible:ring-0 min-h-[150px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="find-time" className="pt-4">
            <div className="text-center py-8 text-gray-500">
              Schedule finder functionality would go here
            </div>
          </TabsContent>

          <TabsContent value="guests" className="pt-4">
            <div className="mb-6">
              <Input placeholder="Add guests" className="bg-gray-100 mb-4" />

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Guest permissions</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="modify-event" />
                    <Label htmlFor="modify-event" className="text-sm">
                      Modify event
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="invite-others" defaultChecked />
                    <Label htmlFor="invite-others" className="text-sm">
                      Invite others
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="see-guest-list" defaultChecked />
                    <Label htmlFor="see-guest-list" className="text-sm">
                      See guest list
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Save Button */}
      <div className="flex justify-end p-4 border-t border-gray-200">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
}

interface DatePickerWithPresetsProps {
  date: Date;
  setDate: (date: Date) => void;
}

function DatePickerWithPresets({ date, setDate }: DatePickerWithPresetsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface TimePickerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function TimePickerSelect({ value, onChange }: TimePickerSelectProps) {
  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {format(new Date(`2000-01-01T${time}`), "HH:mm")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
