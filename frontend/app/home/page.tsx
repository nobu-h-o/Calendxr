"use client";

import Image from "next/image";
import recangle1 from "@/public/landing-page/Rectangle 1.svg";
import recangle2 from "@/public/landing-page/Rectangle 2.svg";
import screenshot from "@/public/landing-page/screenshot.png";
import smallScreen from "@/public/landing-page/small-screen.png";
import mediumScreen from "@/public/landing-page/medium-screen.png";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center md:h-screen bg-white relative overflow-hidden px-0 sm:px-10">
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-32 sm:gap-24 gap-12 items-center z-10 max-w-5xl mx-auto">
        {/* Left side - Text content */}
        <div className="order-2 md:order-1 px-8 md:px-0">
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
            <Link href="/auth/signin">Get Started</Link>
          </button>
        </div>

        {/* Right side - Images */}
        <div className="relative order-1 md:order-2 h-[400px] w-full flex items-center justify-center md:justify-end">
          <Image
            src={screenshot}
            alt="Screenshot"
            className="absolute z-10 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 
              w-[400px] md:w-[500px] lg:w-[600px] scale-125 hidden md:block"
          />
          <Image
            src={mediumScreen}
            alt="Medium Screen"
            className="block w-full  md:hidden mt-24"
          />
          <Image
            src={recangle1}
            alt="Rectangle 1"
            className="absolute right-0 bottom-1/3 md:right-[-70px] 
              w-[300px] md:w-[600px] lg:w-[800px] scale-125 hidden md:block"
          />
          <Image
            src={recangle2}
            alt="Rectangle 2"
            className="absolute left-0 top-1/2 md:right-32 md:left-auto
              w-[250px] md:w-[250px] lg:w-auto scale-110 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
