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

interface TimeSlot {
  start: Date;
  end: Date;
  conflicts: number;
}

interface ApiResponse {
  users: User[];
  totalUsersFound: number;
  bestTimes?: TimeSlot[];
  error?: string;
}

interface FreeTimeSlot {
  start: Date;
  end: Date;
  user: string;
}

const GroupScheduler = () => {
  const [members, setMembers] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lookupdate, setLookupdate] = useState<number>(7);
  const [freeTimeSlots, setFreeTimeSlots] = useState<FreeTimeSlot[]>([]);
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
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

  const handleLookupDateChange = (value: string): void => {
    const numValue = parseInt(value, 10);
    // Ensure it's a positive number
    if (!isNaN(numValue) && numValue > 0) {
      setLookupdate(numValue);
    }
  };

  // Function to find free time slots for each user
  const findFreeTimeSlots = (users: User[], lookAheadDays: number): FreeTimeSlot[] => {
    const freeSlots: FreeTimeSlot[] = [];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + lookAheadDays);
    
    users.forEach(user => {
      const userName = user.name || user.email;
      const userEvents = user.events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })).sort((a, b) => a.start.getTime() - b.start.getTime());
      
      // Start with the current date and time
      let currentTime = new Date();
      
      // For each event, find the gap before it
      for (const event of userEvents) {
        if (currentTime < event.start) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(event.start),
            user: userName
          });
        }
        // Update currentTime to after this event
        currentTime = new Date(Math.max(currentTime.getTime(), event.end.getTime()));
      }
      
      // Add the final slot from the last event to the end date
      if (currentTime < endDate) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(endDate),
          user: userName
        });
      }
    });
    
    return freeSlots;
  };

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchMeetingTime = async () => {
    console.log("Start finding meeting time");
    setLoading(true);
    setHasResults(false);
    setFreeTimeSlots([]);
    setAiAnalysis("");

    try {
      // Filter out empty emails
      console.log("checking email validation");
      const validEmails = members.filter((email) => email.trim() !== "");
      if (!validEmails.length) {
        console.log("email is invalid!");
        throw new Error("Please enter at least one valid email");
      }

      // Fetch user data and their events from the database
      console.log("Start finding user events by email");

      const response = await fetch(`/api/group-scheduler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: validEmails,
          lookAheadDays: lookupdate,
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
      
      console.log("User Data Result: ", data.users);

      if (data.users.length !== validEmails.length) {
        toast({
          title: "Warning",
          description: "Some users were not found in the system",
        });
      }
      
      // Process data to find free time slots
      const freeTimes = findFreeTimeSlots(data.users, lookupdate);
      setFreeTimeSlots(freeTimes);
      setHasResults(true);
      
      // Display success message
      toast({
        title: "Success",
        description: `Found schedules for ${data.users.length} users.`,
      });
      
      // Generate AI analysis of the scheduling data
      await generateAiAnalysis(data.users, freeTimes, lookupdate);
      
    } catch (error: any) {
      console.error("Error finding meeting time:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem finding a meeting time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAiAnalysis = async (users: User[], freeSlots: FreeTimeSlot[], lookAheadDays: number) => {
    try {
      setAiLoading(true);
      
      // Create a simplified data structure to send to the API
      const simplifiedData = {
        users: users.map(user => ({
          name: user.name || user.email,
          email: user.email,
          eventCount: user.events.length,
          busyTimes: user.events.map(event => ({
            title: event.title,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
          }))
        })),
        freeSlots: freeSlots.map(slot => ({
          user: slot.user,
          start: new Date(slot.start).toISOString(),
          end: new Date(slot.end).toISOString(),
          durationHours: Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / (1000 * 60 * 60))
        })),
        lookAheadDays
      };

      // Generate a message for AI analysis
      const userPrompt = "Based on the schedule data provided, what are the best times for a meeting? Please find overlapping free times where all users are available, and suggest the top 3 options. Consider business hours (9 AM - 5 PM) as preferred times.";
      
      const systemMessage = `You are a scheduling assistant. Analyze the following user schedule data and provide suggestions for optimal meeting times:`;
      
      // Call the OpenAI API
      const response = await fetch("/api/analyze-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemMessage,
          userPrompt,
          data: simplifiedData
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze schedules");
      }
      
      const result = await response.json();
      setAiAnalysis(result.analysis || "No analysis available");
      
    } catch (error: any) {
      console.error("Error generating AI analysis:", error);
      setAiAnalysis("Unable to generate scheduling recommendations. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
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
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Days to Look Ahead</h3>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="1"
              value={lookupdate}
              onChange={(e) => handleLookupDateChange(e.target.value)}
              className="w-24"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </div>
        
        <Button
          onClick={fetchMeetingTime}
          className="w-full mb-4"
          disabled={loading}
        >
          {loading ? "Finding times..." : "📅 Find Best Meeting Time"}
        </Button>
        
        {hasResults && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>AI Scheduling Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {aiLoading ? (
                  <div className="flex justify-center items-center p-4">
                    <p>Analyzing schedules...</p>
                  </div>
                ) : (
                  <div className="prose">
                    {aiAnalysis ? (
                      <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                    ) : (
                      <p>No recommendations available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                {freeTimeSlots.length > 0 ? (
                  <div className="space-y-2">
                    {freeTimeSlots.map((slot, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium">{slot.user}</p>
                        <p>From: {formatDateTime(slot.start)}</p>
                        <p>To: {formatDateTime(slot.end)}</p>
                        <p className="text-gray-500 text-sm">
                          Duration: {Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / (1000 * 60 * 60))} hours
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No free time slots found for the selected users.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupScheduler;
