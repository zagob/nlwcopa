import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:
        "622041248557-gn59rmkfnil5t855rpp42cdeknklhuh0.apps.googleusercontent.com",
      clientSecret: "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",
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      //   if (account?.accesssToken) {
      //     token.accesssToken = account.accesssToken;
      //   }
      if (account && user) {
        return {
          accessToken: account.access_token,
        };
      }

      return token;
    },
    async session({ session, token }) {
      // (session.user = token.user), (session.accessToken = token.accessToken);
      session.access_token = token;

      return session;
    },
  },
};

export default NextAuth(authOptions);
