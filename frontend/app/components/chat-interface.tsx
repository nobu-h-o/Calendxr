"use client"
import { Send } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { getMessages, sendChatMessage, createDocumentByText, getKnowledgeBase } from "../../utils/api";
import { useState, useEffect, useRef } from "react";
import { UIMessage } from "ai"

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationID, setConversationID] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchAndStoreCalendarData = async () => {
      try {
        //first delete existing data
        const dataset = await getKnowledgeBase();
        if (!dataset) {
          console.error("Error fetching dataset:", dataset);
          return;
        }
        const datasetId = dataset.data[dataset.data.length - 1]?.id;
        console.log("Dataset ID:", datasetId);
  
        const response = await fetch(`/api/calendar`);
        console.log("Response:", response);
        if (!response.ok) throw new Error("Failed to fetch calendar data");
        const calendarData = await response.json();

        // If data has changed, update the dataset
        await createDocumentByText(datasetId, {
          title: "Calendar Events",
          content: JSON.stringify(calendarData),
        });
    
        console.log("Calendar data updated successfully.");
      } catch (error) {
        console.error("Error fetching and storing calendar data:", error);
      }
    };
    // Run immediately on page load
    fetchAndStoreCalendarData();
    
  }, [conversationID]);
  

  // Load existing messages when conversation ID changes
  useEffect(() => {
    const loadMessages = async () => {
      if (conversationID) {
        try {
          setLoading(true);
          const response = await getMessages(conversationID);
          
          if (response && Array.isArray(response.messages)) {
            const formattedMessages = response.messages.map((msg: any) => ({
              id: msg.id || Date.now().toString(),
              role: msg.role || (msg.is_user ? "user" : "assistant"),
              content: msg.content || msg.text || "",
              parts: [{ type: "text", text: msg.content || msg.text || "" }],
            }));
            
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error loading messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMessages();
  }, [conversationID]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    console.log("Current conversationID:", conversationID);
    
    // Add user message immediately for better UX
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      parts: [{ type: "text", text: message }],
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    
    try {
      const response = await sendChatMessage(currentMessage, conversationID);
      setConversationID(response.conversation_id);
      
      const assistantMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer || "No response",
        parts: [{ type: "text", text: response.answer || "No response" }],
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        parts: [{ type: "text", text: "Sorry, there was an error processing your request." }],
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

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
                <li>"Schedule a team meeting for tomorrow at 2pm"</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
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
