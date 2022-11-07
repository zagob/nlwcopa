import { useState } from "react";
import { Polls } from "./Polls";

interface ButtonNavigationProps {
  active: string;
  name: string;
  onActiveTabNavigation: (title: string) => void;
}

export function ButtonNavigation({
  active,
  name,
  onActiveTabNavigation,
}: ButtonNavigationProps) {
  return (
    <li
      className={`text-gray-100 w-full text-center  ${
        active === name ? "bg-green-700" : ""
      }`}
    >
      <button
        className="w-full h-full py-2"
        onClick={() => onActiveTabNavigation(name)}
        type="button"
      >
        {name}
      </button>
    </li>
  );
}

export function Menu() {
  const [nameActiveTabNavigation, setNameActiveTabNavigation] =
    useState("Meus Bolões");
  return (
    <div className="">
      <ul className="flex justify-center border border-gray-600">
        <ButtonNavigation
          name="Meus Bolões"
          active={nameActiveTabNavigation}
          onActiveTabNavigation={(title) => setNameActiveTabNavigation(title)}
        />
        <ButtonNavigation
          name="Ranking de bolões"
          active={nameActiveTabNavigation}
          onActiveTabNavigation={(title) => setNameActiveTabNavigation(title)}
        />
      </ul>

      {nameActiveTabNavigation === "Meus Bolões" && <Polls />}
    </div>
  );
}
