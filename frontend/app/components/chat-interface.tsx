"use client"
import { Send } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { useState, useEffect, useRef } from "react"
import { UIMessage } from "ai"
import { useSession } from "next-auth/react";

export function ChatInterface() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [conversationID, setConversationID] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initial load of user data - runs only once when session is available
  useEffect(() => {
    if (session?.user && !initialLoadComplete) {
      loadUserData();
      setInitialLoadComplete(true);
    }
  }, [session, initialLoadComplete]);

  // Function to load user data and calendar events
  const loadUserData = async () => {
    if (!session?.user?.email) {
      console.error("Email not found.");
      return;
    }

    try {
      const res = await fetch(`/api/calendar/get`);
      const calendarData = await res.json();
      
      const filteredData = calendarData.map(({ id, title, start, end }: { id: string; title: string; start: string; end: string }) => ({
        id,
        title,
        start: new Date(start),
        end: new Date(end),
      }));
      console.log("Data loaded");

      await saveUserData(filteredData);
      console.log("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to save user data
  const saveUserData = async (events: any[]) => {
    if (!session?.user?.email || !session?.user?.name) return;
    
    const { email, name } = session.user;
    try {
      const saveRes = await fetch(`/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, events }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save user and events.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages]);

  // Function to update data after new event is added
  const updateAfterEventChange = async () => {
    if (session?.user) {
      await loadUserData();
    }
  };

  // Make this function available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.updateCalendarData = updateAfterEventChange;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        delete window.updateCalendarData;
      }
    };
  }, [session]);

  // Directly call the API route (/api/chatbot) on form submission
  const handleSendMessages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)

    // Add user's message immediately for better UX
    const userMsg: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      parts: [{ type: "text", text: message }]
    }
    setMessages(prev => [...prev, userMsg])
    const currentMessage = message
    setMessage("")

    try {
      const payload = {
        message: currentMessage,
        conversationId: conversationID || undefined
      }
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      setConversationID(data.conversation_id)
      const assistantMsg: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "No response",
        parts: [{ type: "text", text: data.answer || "No response" }]
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMsg: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        parts: [{ type: "text", text: "Sorry, there was an error processing your request." }]
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1 flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle>Calendxr AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
              <p>Ask me anything about your calendar!</p>
              <p className="text-sm mt-2">For example:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>"What meetings do I have today?"</li>
                <li>"When is my next client call?"</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-75" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <form onSubmit={handleSendMessages} className="flex w-full gap-2">
          <Input
            placeholder="Ask about your calendar..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
