"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-4 py-2 font-medium text-black bg-white rounded border border-black hover:bg-gray-200"
      >
        Sign in with Google
      </button>
    </div>
  );
}