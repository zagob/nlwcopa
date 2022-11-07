import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <Component {...pageProps} />;
      </AuthProvider>
    </SessionProvider>
  );
}
