"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}