import { Calendar } from "@/components/calendar"
import { ChatInterface } from "@/components/chat-interface"
import Link from "next/link"

export default function CalendarApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold">Calendxr</h1>
          <Link href="/auth/signin">
            <button className="px-4 py-2 font-medium text-black bg-white rounded border border-black hover:bg-gray-200">
              Sign In
            </button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container grid gap-6 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px] p-4 pt-6">
        <Calendar />
        <ChatInterface />
      </main>
    </div>
  )
}
