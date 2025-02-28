import { Calendar } from "@/components/calendar"
import { ChatInterface } from "@/components/chat-interface"

export default function CalendarApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center h-16 px-4">
          <h1 className="text-xl font-bold">Calendar Assistant</h1>
        </div>
      </header>
      <main className="flex-1 container grid gap-6 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px] p-4 pt-6">
        <Calendar />
        <ChatInterface />
      </main>
    </div>
  )
}

