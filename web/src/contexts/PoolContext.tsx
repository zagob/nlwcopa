import {
  ChangeEvent,
  createContext,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/axios";

interface PoolContextProps {
  polls: PollsProps[];
  CopyCode: CopyCodeProps;
  poolTitle: string;
  changePoolTitle: (title: string) => void;
  handleClipboardCopy: (code: string) => void;
  handleCreatePool: (event: FormEvent) => Promise<void>;
}

interface PoolProviderProps {
  children: ReactNode;
}

interface PollsProps {
  id: string;
  title: string;
  code: string;
}

interface CopyCodeProps {
  isCopy: boolean;
  code: string;
}

export const PoolContext = createContext({} as PoolContextProps);

export function PoolProvider({ children }: PoolProviderProps) {
  const { session } = useAuth();
  const [poolTitle, setPoolTitle] = useState("");
  const [CopyCode, setCopyCode] = useState({} as CopyCodeProps);
  const [polls, setPolls] = useState<PollsProps[]>([]);

  function changePoolTitle(title: string) {
    setPoolTitle(title);
  }

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência"
      );

      setPoolTitle("");
      fetchPolls();
    } catch (err) {
      console.log(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }

  async function handleClipboardCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopyCode({ code, isCopy: true });
    setTimeout(() => {
      setCopyCode({ code: "", isCopy: false });
    }, 2000);
  }

  async function fetchPolls() {
    const { data: responsePolls } = await api.get("/polls");
    setPolls(responsePolls.polls);
  }

  useEffect(() => {
    if (session) {
      fetchPolls();
    }
  }, [session]);
  return (
    <PoolContext.Provider
      value={{
        CopyCode,
        polls,
        poolTitle,
        handleClipboardCopy,
        handleCreatePool,
        changePoolTitle,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
}
