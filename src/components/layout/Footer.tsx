"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="w-full border-t bg-background py-6">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex items-center gap-2">
                        <Printer className="h-6 w-6" />
                        <p className="text-sm leading-loose text-muted-foreground">
                            {t('footer.about')}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('footer.rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
