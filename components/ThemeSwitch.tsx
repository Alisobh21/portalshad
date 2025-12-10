"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";

// استخدم أيقوناتك الحالية
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={clsx(
        `
        h-9 w-9 flex items-center justify-center rounded-full 
        bg-neutral-200 dark:bg-neutral-700
        hover:bg-neutral-300 dark:hover:bg-neutral-600
        transition-colors duration-200
        shadow-sm dark:shadow-none
        `,
        className
      )}
    >
      {isDark ? <SunFilledIcon size={20} /> : <MoonFilledIcon size={20} />}
    </button>
  );
};
