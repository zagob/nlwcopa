import { useContext } from "react";
import { PoolContext } from "../contexts/PoolContext";

export function usePool() {
  const usePool = useContext(PoolContext);

  return usePool;
}
