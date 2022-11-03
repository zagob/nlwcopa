import { useContext } from "react";

import {
  AuthContext,
  AuthProvider,
  AuthContextProps,
} from "../contexts/AuthContext";

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  return context;
}
