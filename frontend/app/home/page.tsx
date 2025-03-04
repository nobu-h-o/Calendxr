"use client";

import Image from "next/image";
import smallScreen from "@/public/landing-page/small-screen.png";
import largeScreen from "@/public/landing-page/large-screen.png";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen no-scrollbar">
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/home">
            <h1 className="text-xl font-bold">Calendxr.com</h1>
          </Link>
          {!session ? (
            <Link href="/auth/signin">
              <button className="px-4 py-2 font-medium text-black bg-white rounded border border-black hover:bg-gray-200">
                Sign In
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <a target="_blank" href="https://myaccount.google.com/?tab=kk">
                <img
                  src={session!.user!.image ?? "/fallback-profile.png"}
                  alt="Profile Picture"
                  className="w-8 h-8 rounded-full"
                />
              </a>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 font-medium text-black bg-white rounded border border-black hover:bg-gray-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white relative px-0 sm:px-10 py-8">
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-16 sm:gap-12 gap-8 items-center z-10 max-w-7xl mx-auto w-full">
          {/* Left side - Text content */}
          <div className="order-2 md:order-1 px-4 md:px-0">
            <h1 className="text-3xl md:text-4xl font-bold">
              Simplify your Calendar,
              <br /> with the power of AI
            </h1>
            <p className="text-gray-600 mt-4 font-semibold">
              Calendxr is an AI-powered event management tool that helps you
              organize your schedule effortlessly. It can import event details
              from images and optimize group meeting schedules based on
              availability.
            </p>
            {!session ? (
              <Link href="/auth/signin" className="inline-block">
                <button className="mt-8 px-6 py-2 bg-black text-white rounded-lg font-semibold w-full">
                  Get Started
                </button>
              </Link>
            ) : (
              <Link href="/" className="inline-block">
                <button className="mt-8 px-6 py-2 bg-black text-white rounded-lg font-semibold w-full">
                  Return to Calendxr
                </button>
              </Link>
            )}
          </div>

          {/* Right side - Images */}
          <div className="relative order-1 md:order-2 xl:col-span-2 min-h-[300px] md:h-auto w-full flex items-center justify-center md:justify-end">
            <Image
              src={smallScreen}
              alt="Medium Screen"
              className="block w-full max-w-[450px] lg:hidden mt-8"
            />
            <Image
              src={largeScreen}
              alt="Large Screen"
              className="hidden lg:block w-full max-w-[1050px] mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
