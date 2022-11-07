import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const useAuth = useContext(AuthContext);

  return useAuth;
}
