import { Check, Copy } from "phosphor-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/axios";

interface PollsProps {
  id: string;
  title: string;
  code: string;
}

interface CopyCodeProps {
  isCopy: boolean;
  code: string;
}

export function Polls() {
  const { session } = useAuth();
  const [CopyCode, setCopyCode] = useState({} as CopyCodeProps);
  const [polls, setPolls] = useState<PollsProps[]>([]);

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
      console.log("session", session);
      fetchPolls();
    }
  }, []);
  return (
    <section className="min-h-[600px] overflow-y-auto">
      {polls.map((poll) => (
        <div
          key={poll.id}
          className="border border-gray-700 rounded text-gray-200 flex items-center gap-4 p-2 my-2"
        >
          <span>{poll.title}</span>
          <div className="flex items-center gap-2">
            <strong>{poll.code}</strong>
            {CopyCode.isCopy && CopyCode.code === poll.code ? (
              <div className="flex items-center gap-1">
                <Check className="text-green-500" size={18} />
                <span className="text-xs text-gray-500">Copiado</span>
              </div>
            ) : (
              <Copy
                className="cursor-pointer"
                onClick={() => handleClipboardCopy(poll.code)}
              />
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
