"use client";

import { signIn } from "next-auth/react";
import googleLogo from "@/public/sign-in-page/google-logo.svg";
import Image from "next/image";

import rectangle1 from "@/public/sign-in-page/Rectangle 1.svg";
import rectangle2 from "@/public/sign-in-page/Rectangle 2.svg";
import rectangle3 from "@/public/sign-in-page/Rectangle 3.svg";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Image
        src={rectangle1}
        alt="bg"
        className="absolute top-0 left-0 w-[200px] md:w-[300px] lg:w-auto"
      />
      <Image
        src={rectangle3}
        alt="bg"
        className="absolute bottom-0 right-0 w-[150px] md:w-[250px] lg:w-auto"
      />
      <Image
        src={rectangle2}
        alt="bg"
        className="absolute bottom-0 right-32 w-[100px] md:w-[200px] lg:w-auto"
      />
      <div className="w-full max-w-xl bg-white rounded-xl p-8">
        {/* Logo Section */}
        <div className=" mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Get Started with Calendxr
          </h2>
          <p className="text-gray-500 font-semibold mt-2">
            Sign in with your Google Account to sync with your existing
            calendar.
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
