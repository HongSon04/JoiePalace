import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import {
//   GOOGLE_ID,
//   GOOGLE_SECRET,
//   NEXTAUTH_SECRET,
// } from "@/app/_utils/googleKey.config";
import nextConfig from "@/next.config.mjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: nextConfig.env.GOOGLE_ID,
      clientSecret: nextConfig.env.GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/dang-nhap",
  },
  secret: nextConfig.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
