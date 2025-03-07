import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { toast } from "@/app/components/ui/use-toast";

interface AlternativeTime {
  formatted: string;
  conflicts: number;
}

interface BestMeetingTime {
  formatted: string;
  conflicts: number;
  alternatives: AlternativeTime[];
}

interface UserEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  events: UserEvent[];
}

interface ApiResponse {
  users: User[];
  totalUsersFound: number;
  bestTimes?: TimeSlot[];
  error?: string;
}

interface TimeSlot {
  start: Date;
  end: Date;
  conflicts: number;
}

export default function GroupScheduler(): JSX.Element {
  const [members, setMembers] = useState<string[]>([""]);
  const [bestMeetingTime, setBestMeetingTime] =
    useState<BestMeetingTime | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const api_url = "http://localhost:3000";

  const handleAddMember = (): void => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index: number): void => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers.length ? newMembers : [""]); // Keep at least one input
  };

  const handleMemberChange = (index: number, value: string): void => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const findAvailableTimes = async (
    userEvents: UserEvent[][]
  ): Promise<TimeSlot[]> => {
    // Start with next 7 days, business hours (9am-5pm)
    const potentialSlots: TimeSlot[] = [];
    const now = new Date();
    // find free day in a week
    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      console.log("date", date);
      date.setDate(now.getDate() + day);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Check each hour from 9am to 4pm (last slot starts at 4pm and ends at 5pm)
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);

        // Skip slots in the past
        if (startTime <= now) continue;

        potentialSlots.push({
          start: startTime,
          end: endTime,
          conflicts: 0,
        });
      }
    }

    // Check each user's events against potential slots
    userEvents.forEach((userEventList) => {
      userEventList.forEach((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        potentialSlots.forEach((slot) => {
          // Check if this event conflicts with the slot
          if (
            (eventStart < slot.end && eventEnd > slot.start) ||
            (eventStart.getTime() === slot.start.getTime() &&
              eventEnd.getTime() === slot.end.getTime())
          ) {
            slot.conflicts++;
          }
        });
      });
    });

    // Sort slots by number of conflicts (ascending)
    potentialSlots.sort((a, b) => a.conflicts - b.conflicts);

    // Return the top 3 best times
    return potentialSlots.slice(0, 3);
  };

  const fetchMeetingTime = async () => {
    console.log("Start finding meeting tiem");
    // console.log("nbiawi");
    setLoading(true);
    setBestMeetingTime(null);

    try {
      // Filter out empty emails
      console.log("checking email validation");
      const validEmails = members.filter((email) => email.trim() !== "");
      if (!validEmails) {
        console.log("email is invalid!");
      }

      // Fetch user data and their events from the database
      console.log("Start finding user events by email");

      const response = await fetch(`${api_url}/api/group-scheduler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: validEmails,
          lookAheadDays: 7, // Look 7 days ahead
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user schedules");
      }
      console.log("End finding user events by email");
      const data: ApiResponse = await response.json();
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      console.log(data);
      console.log("User Data Result: ", data.users);

      if (data.users.length !== validEmails.length) {
        toast({
          title: "Warning",
          description: "Some users were not found in the system",
        });
      }

      // Find available time slots
      const bestTimes = await findAvailableTimes(
        data.users.map((user) => user.events)
      );

      if (bestTimes.length === 0) {
        toast({
          title: "No available times",
          description:
            "Could not find any suitable time slots in the next 7 days",
          variant: "destructive",
        });
        return;
      }

      // Format the best time for display
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      // bestTimes has top 3 options
      const bestTime = bestTimes[0];
      setBestMeetingTime({
        formatted: `${bestTime.start.toLocaleString(
          "en-US",
          options
        )} - ${bestTime.end.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`,
        conflicts: bestTime.conflicts,
        alternatives: bestTimes.slice(1).map((time) => ({
          formatted: `${time.start.toLocaleString(
            "en-US",
            options
          )} - ${time.end.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}`,
          conflicts: time.conflicts,
        })),
      });
    } catch (error) {
      console.error("Error finding meeting time:", error);
      toast({
        title: "Error",
        description:
          "There was a problem finding a meeting time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>📅 Group Scheduler</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-2">Members</h3>
          {members.map((member, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Enter Email"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="flex-grow"
              />
              {members.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => handleRemoveMember(index)}
                  className="px-3"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button onClick={handleAddMember} className="mb-4">
            ➕ Add Member
          </Button>
          <Button
            onClick={fetchMeetingTime}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Finding times..." : "📅 Find Best Meeting Time"}
          </Button>

          {bestMeetingTime && (
            <div className="mt-4 p-4 border rounded-md bg-green-50">
              <h4 className="font-bold text-green-700">Best Meeting Time:</h4>
              <p className="text-green-600 font-semibold mb-2">
                {bestMeetingTime.formatted}
              </p>
              {bestMeetingTime.conflicts > 0 && (
                <p className="text-amber-600 text-sm mb-3">
                  Note: {bestMeetingTime.conflicts}{" "}
                  {bestMeetingTime.conflicts === 1
                    ? "member has"
                    : "members have"}{" "}
                  a conflict at this time
                </p>
              )}

              {bestMeetingTime.alternatives.length > 0 && (
                <>
                  <h4 className="font-bold text-gray-700 mt-2">
                    Alternative Times:
                  </h4>
                  <ul className="mt-1">
                    {bestMeetingTime.alternatives.map((alt, index) => (
                      <li key={index} className="text-gray-600 mb-1">
                        {alt.formatted}
                        {alt.conflicts > 0 && (
                          <span className="text-amber-600 text-sm">
                            {" "}
                            ({alt.conflicts}{" "}
                            {alt.conflicts === 1 ? "conflict" : "conflicts"})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
