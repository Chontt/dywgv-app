"use client";

import { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import AppNav from "./components/AppNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AppNav />
      {children}
    </I18nProvider>
  );
}
