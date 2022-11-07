import { AxiosError } from "axios";
import { DefaultSession, Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/axios";

interface AuthContextProps {
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => void;
  session: {
    user: DefaultSession;
    expires: DefaultSession;
    accessTokenAPI: string;
  } | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface SessionProps extends Session {
  status: "authenticated" | "loading" | "unauthenticated";
  data: {
    user: DefaultSession;
    expires: DefaultSession;
    accessTokenAPI: string;
  } | null;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession() as SessionProps;
  if (session) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session?.accessTokenAPI}`;
  }

  async function handleSignInWithGoogle() {
    await signIn();
  }

  function handleSignOut() {
    signOut();
  }

  async function fetchAuth() {
    try {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session?.accessTokenAPI}`;
      const { data: responseData, statusText } = await api.get("/me");

      if (statusText === "Unauthorized") {
        throw Error(statusText);
      }
    } catch (err) {
      console.log("err response", err);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ handleSignInWithGoogle, handleSignOut, session }}
    >
      {children}
    </AuthContext.Provider>
  );
}
