import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../../services/axios";

const GOOGLE_AUTHORIZATION_URL =
  `${process.env.NEXT_PUBLIC_GOOGLE_URL}` +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
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
      if (session && token) {
        const { data: resToken } = await api.post("/users", {
          access_token: token.token,
        });

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${resToken.token}`;

        // session.accessToken = token.token;
        session.accessTokenAPI = resToken.token;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
