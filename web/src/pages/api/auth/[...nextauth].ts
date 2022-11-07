import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../../services/axios";

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
  secret: "teste",
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && user) {
        return {
          ...token,
          token: account.access_token,
        };
      }

      return token;
    },
    async session({ session, token, user }) {
      const { data: resToken } = await api.post("/users", {
        access_token: token.token,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${resToken.token}`;

      session.accessToken = token.token;
      session.accessTokenAPI = resToken.token;

      return session;
    },
  },
};

export default NextAuth(authOptions);
