"use client";

import Image from "next/image";
import recangle1 from "@/public/landing-page/Rectangle 1.svg";
import recangle2 from "@/public/landing-page/Rectangle 2.svg";
import screenshot from "@/public/landing-page/screenshot.png";
import mediumScreen from "@/public/landing-page/medium-screen.png";
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
              <img
                src={session!.user!.image ?? "/fallback-profile.png"}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full"
              />
              <button onClick={() => signOut()} className="px-4 py-2 font-medium text-black bg-white rounded border border-black hover:bg-gray-200">Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white relative px-0 sm:px-10 py-8">
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 sm:gap-12 gap-8 items-center z-10 max-w-5xl mx-auto w-full">
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
            <button className="mt-8 px-6 py-2 bg-black text-white rounded-lg font-semibold">
              {!session ? (
                <Link href="/auth/signin">Get Started</Link>
              ) : (
                <Link href="/">Return to Calendxr</Link>
              )}
            </button>
          </div>

          {/* Right side - Images */}
          <div className="relative order-1 md:order-2 min-h-[300px] md:h-auto w-full flex items-center justify-center md:justify-end">
            <Image
              src={screenshot}
              alt="Screenshot"
              className="absolute z-10 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0
                w-[350px] md:w-[450px] lg:w-[550px] scale-100 md:scale-110 hidden md:block"
            />
            <Image
              src={mediumScreen}
              alt="Medium Screen"
              className="block w-full max-w-[350px] md:hidden mt-8"
            />
            <Image
              src={recangle1}
              alt="Rectangle 1"
              className="absolute right-0 bottom-1/3 md:right-[-50px]
                w-[250px] md:w-[500px] lg:w-[700px] scale-100 hidden md:block"
            />
            <Image
              src={recangle2}
              alt="Rectangle 2"
              className="absolute left-0 top-1/2 md:right-32 md:left-auto
                w-[200px] md:w-[200px] lg:w-[250px] scale-100 hidden md:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
