import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import {
//   GOOGLE_ID,
//   GOOGLE_SECRET,
//   NEXTAUTH_SECRET,
// } from "@/app/_utils/googleKey.config";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/dang-nhap",
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
