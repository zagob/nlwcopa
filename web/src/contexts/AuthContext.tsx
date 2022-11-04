import { createContext, ReactNode, useState } from "react";

interface AuthContextProps {}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState();
  

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
