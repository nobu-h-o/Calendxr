"use client"
import { Send } from "lucide-react"
import { useChat } from "ai/react"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { getMessages, sendChatMessage } from "../../utils/api";
import { useState, useEffect } from "react";
import { UIMessage } from "ai"

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);  
  const [conversationID, setConversationID] = useState("");

  const handleSendMessages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Current conversationID:", conversationID);
    const response = await sendChatMessage(message, conversationID);
    setConversationID(response.conversation_id)
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      parts: [{ type: "text", text: message }],
    };
  
    const assistantMessage: UIMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.answer || "No response",
      parts: [{ type: "text", text: response.answer || "No response" }],
    };
  
    setMessages([...messages, userMessage, assistantMessage]);
    setMessage("");
    setLoading(false);
  };

  return (
    <Card className="col-span-1 flex flex-col h-[calc(100vh-120px)]">
      <CardHeader>
        <CardTitle>Calendxr AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
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
