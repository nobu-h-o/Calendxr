"use client";

import { signIn } from "next-auth/react";
import googleLogo from "@/public/google-logo.svg";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo Section */}
        <div className=" mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Calendxr</h2>
          <p className="text-gray-500 mt-2">
            Sign in to sync with your Google Calendar
          </p>
        </div>

        {/* Login Section */}
        <div className="space-y-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 
              text-gray-700 bg-white rounded-3xl border border-gray-300 
              hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <Image src={googleLogo} alt="Google logo" width={30} height={30} />
            Sign in with Google
          </button>

          <div className="text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
