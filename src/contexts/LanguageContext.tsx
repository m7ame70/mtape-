"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries } from "@/lib/dictionaries";

type Locale = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
    locale: Locale;
    direction: Direction;
    setLanguage: (lang: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>("en");
    const [direction, setDirection] = useState<Direction>("ltr");

    useEffect(() => {
        // Load from local storage
        const savedLocale = localStorage.getItem("locale") as Locale;
        if (savedLocale) {
            setLanguage(savedLocale);
        }
    }, []);

    const setLanguage = (lang: Locale) => {
        const dir = lang === "ar" ? "rtl" : "ltr";
        setLocale(lang);
        setDirection(dir);
        localStorage.setItem("locale", lang);
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = dictionaries[locale];

        for (const k of keys) {
            value = value?.[k];
            if (!value) break;
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, direction, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
