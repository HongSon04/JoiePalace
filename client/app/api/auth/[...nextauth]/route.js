"use server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  GOOGLE_ID,
  GOOGLE_SECRET,
  NEXTAUTH_SECRET,
} from "@/app/_utils/googleKey.config";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/dang-nhap",
  },
  secret: NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
