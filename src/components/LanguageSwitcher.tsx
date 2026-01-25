"use client";

import * as React from "react";
import { Check, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
    const { locale, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className="justify-between">
                    English
                    {locale === "en" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")} className="justify-between font-arabic">
                    العربية
                    {locale === "ar" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
