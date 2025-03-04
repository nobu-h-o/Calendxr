"use client"

import { useState, useEffect } from "react"
import { addDays, format, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCalendarEvents } from "@/lib/calendar"

interface CalendarEvent {
  id: number;
  title: string;
  date: string;  // ISO formatted date string
  duration: number;
  attendees: {
    name: string;
    avatar: string;
  }[];
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getCalendarEvents()
        setEvents(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Calendar</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div key={day.toString()} className="text-center">
              <div className="font-medium mb-1">{format(day, "EEE")}</div>
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                  format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(event.date), "h:mm a")}
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {event.attendees.map((attendee, i: number) => (
                    <Avatar key={i} className="border-2 border-background w-8 h-8">
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <Button className="w-full mt-6" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </CardContent>
    </Card>
  )
}
