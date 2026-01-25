"use strict";
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </NextThemesProvider>
        </SessionProvider>
    );
}
