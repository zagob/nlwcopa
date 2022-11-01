import Image from "next/image";
import iconCheckImg from "../assets/icon-check.svg";

interface ShowUtilitiesProps {
  counts: number;
  title: string;
}

export function ShowUtilities({ counts, title }: ShowUtilitiesProps) {
  return (
    <div className="flex items-center gap-6">
      <Image src={iconCheckImg} quality={100} alt="" />
      <div className="flex flex-col">
        <span className="font-bold text-2xl">+{counts}</span>
        <span>{title}</span>
      </div>
    </div>
  );
}
