"use client";

import { useTheme } from "next-themes";
import { Logo } from "./logo";
import { ColorModeSwitcher } from "./color-mode-switcher";

export default function HandlerHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <header className="fixed w-full z-50 p-4 h-14 flex items-center py-4 border-b justify-between bg-background">
        <Logo link={"/dashboard"} />

        <div className="flex items-center justify-end gap-5">
          <ColorModeSwitcher />
        </div>
      </header>
      <div className="min-h-14" />
    </>
  );
}
