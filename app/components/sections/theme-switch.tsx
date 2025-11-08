"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
interface ThemeSwitchProps {
  className?: string;
  localTheme: "light" | "dark";
  setLocalTheme: (theme: "light" | "dark") => void;
}

export default function ThemeSwitch({
  className,
  localTheme,
  setLocalTheme,
}: ThemeSwitchProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <button
      onClick={() => setLocalTheme(localTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center",
        className,
      )}
      aria-label="Toggle theme"
      type="button"
    >
      {localTheme === "light" ? (
        <SunIcon className="h-4 w-4 text-black dark:text-white" />
      ) : (
        <MoonIcon className="h-4 w-4 text-black dark:text-white" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
