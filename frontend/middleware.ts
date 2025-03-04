import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/home",
  },
});

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|auth/signin).*)",
  ],
};