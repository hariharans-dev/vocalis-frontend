"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export function Provider(props: { children?: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class">{props.children}</NextThemesProvider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
