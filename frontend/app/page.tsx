"use client";

import Calendar from "@/app/components/Calendar";
import { ChatInterface } from "@/app/components/chat-interface";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@/styles/themes.css"; // Import our custom theme CSS

export default function CalendarApp() {
  const { data: session } = useSession();
  const [scrollY, setScrollY] = useState(0);

  // Add theme classes to body for calendar-specific styles
  useEffect(() => {
    // Handle scroll event to update the position of the chat interface
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-10 bg-white dark:bg-gray-900 colorful:bg-background">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/home">
            <h1 className="text-xl font-bold site-logo">Calendxr.com</h1>
          </Link>
          {!session ? (
            <a>Loading...</a>
          ) : (
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <a target="_blank" href="https://myaccount.google.com/?tab=kk">
                <img
                  src={session!.user!.image ?? "/fallback-profile.png"}
                  alt="Profile Picture"
                  className="w-8 h-8 rounded-full"
                />
              </a>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 font-medium rounded border sign-out-button
                  bg-white text-black border-black hover:bg-gray-200
                  dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700
                  colorful:bg-primary colorful:text-white colorful:border-primary colorful:hover:bg-opacity-90"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 grid gap-6 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px] p-4 pt-6 relative">
        <Calendar />
        <div className="chat-interface-wrapper relative">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-auto">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
