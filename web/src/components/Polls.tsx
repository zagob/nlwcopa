import { Check, Copy } from "phosphor-react";
import { usePool } from "../hooks/usePool";

export function Polls() {
  const { polls, CopyCode, handleClipboardCopy } = usePool();

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
