import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { PoolProvider } from "../contexts/PoolContext";
import "../styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <PoolProvider>
          <Component {...pageProps} />;
        </PoolProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
