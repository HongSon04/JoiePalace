import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  // GOOGLE_ID,
  // GOOGLE_SECRET,
  NEXTAUTH_SECRET,
} from "@/app/_utils/googleKey.config";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "697374533132-drs6mt7kui60vukftijiiq7biji9qcg4.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  pages: {
    signIn: "/dang-nhap",
  },
  secret: NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
