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
          <div className="flex items-center space-x-4">
            <a href="https://github.com/nobu-h-o/Calendxr" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-gray-600">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
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
            <div className="flex items-center mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-sm text-green-700">
                <span className="font-medium">Security-first:</span> We use secure PostgreSQL database and only store essential data to provide you with the best experience.
              </p>
            </div>
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

      {/* Key Features Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-xl text-gray-500">Discover how Calendxr revolutionizes your scheduling experience</p>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Feature 1: ChatBot with RAG */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Intelligent Calendar Assistant</h3>
              <p className="mt-4 text-lg text-gray-500 text-center">
                Powered by Dify's RAG technology, our intelligent chatbot understands your scheduling needs and answers all your calendar-related questions.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Answers scheduling questions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Suggests optimal meeting times</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Learns from your scheduling preferences</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Event creation through images */}
            <div className="flex flex-col items-center">
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Image-to-Event Conversion</h3>
              <p className="mt-4 text-lg text-gray-500 text-center">
                Scan flyers, invitations, or business cards using Google Cloud Vision technology to instantly create calendar events with all details extracted.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Extract dates, times, and locations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Recognize event details from photos</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Save time with instant event creation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Security Banner */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-6">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Your Data Security Is Our Priority</h2>
          <p className="text-xl text-gray-500 mb-6">
            We use Prisma with PostgreSQL to securely store your data while maintaining strong privacy practices. Our code is open source so you can verify our security standards.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-left">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How we protect your data:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><a className="font-bold">Secure PostgreSQL database</a> - with minimal data storage for your events and preferences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Your calendar events are <a className="font-bold">securely managed</a> through your Google account integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Your uploaded images for event creation are processed and then <a className="font-bold">not retained long-term</a></span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">We implement <a className="font-bold">industry-standard encryption</a> for all sensitive data</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Our code is 100% <a className="font-bold">open source</a> - you can verify our security practices yourself</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block p-3 bg-indigo-50 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We're Fully Open Source</h2>
              <p className="text-lg text-gray-600 mb-8">
                Calendxr's code is completely open source and available on GitHub. We believe in transparency and community-driven development. Check out our repository to see exactly how we handle your data and process information.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Transparency</h3>
                    <p className="mt-1 text-gray-600">See exactly how we process your data and handle your information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Community</h3>
                    <p className="mt-1 text-gray-600">Contribute to the project, report issues, or suggest improvements</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Developer Friendly</h3>
                    <p className="mt-1 text-gray-600">Fork the repo to create your own version or integrate our code into your projects</p>
                  </div>
                </div>
              </div>
              
              <a href="https://github.com/nobu-h-o/Calendxr" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                View Source Code
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4 border-b pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 mr-3">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Calendxr</h3>
                  <p className="text-sm text-gray-500">AI-powered calendar management application</p>
                </div>
              </div>
              
              <div className="mb-6 font-mono bg-gray-50 p-4 rounded text-sm text-gray-700 overflow-x-auto">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">+</span>
                  <span className="text-gray-600 mr-2">import</span> 
                  <span className="text-blue-600">GoogleCloudVision</span> 
                  <span className="text-gray-600">from</span> 
                  <span className="text-green-600">'@/lib/vision'</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">+</span>
                  <span className="text-gray-600 mr-2">import</span> 
                  <span className="text-blue-600">DifyRAG</span> 
                  <span className="text-gray-600">from</span>
                  <span className="text-green-600">'@/lib/chatbot'</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">+</span>
                  <span className="text-gray-600 mr-2">import</span> 
                  <span className="text-blue-600">prisma</span> 
                  <span className="text-gray-600">from</span>
                  <span className="text-green-600">'@/lib/prisma'</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-5">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Stars: 8</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Forks: 0</span>
                  </div>
                </div>
                <div className="text-gray-500">Last updated: Mar 2025</div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Next.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Google Cloud Vision</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Dify</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Tailwind CSS</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">TypeScript</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">NextAuth.js</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Prisma</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-xl text-gray-500">Three simple steps to transform your scheduling experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Sign Up</h3>
              <p className="mt-2 text-base text-gray-500">Connect your Google Calendar and create your Calendxr account in seconds with secure data storage.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Upload Images</h3>
              <p className="mt-2 text-base text-gray-500">Take photos of event flyers, invitations or use our chatbot to describe your event.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Manage Events</h3>
              <p className="mt-2 text-base text-gray-500">Review, edit, and manage your events with our intuitive interface.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to transform your scheduling experience?</h2>
          <p className="mt-4 text-xl text-indigo-100">Join thousands of users who've simplified their calendar management with Calendxr.</p>
          {!session ? (
            <Link href="/auth/signin">
              <button className="mt-8 px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition duration-300">
                Get Started for Free
              </button>
            </Link>
          ) : (
            <Link href="/">
              <button className="mt-8 px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition duration-300">
                Go to Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Calendxr</h3>
            <p className="text-gray-400">AI-powered calendar management for modern professionals.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Chatbot Assistant</li>
              <li>Image-to-Event</li>
              <li>Group Scheduling</li>
              <li>Smart Reminders</li>
              <li>Secure Data Storage</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Help Center</li>
              <li>API Documentation</li>
              <li>Developers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Calendxr.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}