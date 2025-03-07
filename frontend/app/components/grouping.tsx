import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
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

const GroupScheduler = () => {
  const [members, setMembers] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lookupdate, setLookupdate] = useState<number>(7);
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

  const fetchMeetingTime = async () => {
    console.log("Start finding meeting time");
    // console.log("nbiawi");
    setLoading(true);

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

      const response = await fetch(`${api_url}/api/group-scheduler`, {
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
      console.log(data);
      console.log("User Data Result: ", data.users);

      if (data.users.length !== validEmails.length) {
        toast({
          title: "Warning",
          description: "Some users were not found in the system",
        });
      }
      
      // Display success message
      toast({
        title: "Success",
        description: `Found schedules for ${data.users.length} users.`,
      });
      
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
          className="w-full"
          disabled={loading}
        >
          {loading ? "Finding times..." : "📅 Find Best Meeting Time"}
        </Button>
      </div>
    </div>
  );
};

export default GroupScheduler;
