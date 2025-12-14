"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: ReactNode;
  themeProps?: Parameters<typeof ThemeProvider>[0];
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...themeProps}
    >
      {children}
    </ThemeProvider>
  );
}
