"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Printer } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Printer className="h-6 w-6 text-primary" />
                        <span>PrintingHouse</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.home')}
                    </Link>
                    <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.services')}
                    </Link>
                    <Link href="/gallery" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.gallery')}
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.about')}
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        {t('nav.contact')}
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    {session ? (
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="outline" size="sm">Dashboard</Button>
                                </Link>
                            )}
                            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Avatar className="h-8 w-8 border-2 border-primary/20">
                                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{session.user?.name}</span>
                            </Link>
                            <Button onClick={() => signOut()} variant="ghost" size="sm">Sign Out</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-6">
                            <div className="grid gap-4 py-4">
                                <Link href="/" className="text-lg font-medium">{t('nav.home')}</Link>
                                <Link href="/services" className="text-lg font-medium">{t('nav.services')}</Link>
                                <Link href="/gallery" className="text-lg font-medium">{t('nav.gallery')}</Link>
                                <Link href="/about" className="text-lg font-medium">{t('nav.about')}</Link>
                                <Link href="/contact" className="text-lg font-medium">{t('nav.contact')}</Link>
                                <div className="border-t my-2 pt-4">
                                    {session ? (
                                        <div className="grid gap-2">
                                            <Link href="/profile">
                                                <Button variant="ghost" className="w-full">Profile</Button>
                                            </Link>
                                            {isAdmin && (
                                                <Link href="/admin">
                                                    <Button variant="outline" className="w-full">Dashboard</Button>
                                                </Link>
                                            )}
                                            <Button onClick={() => signOut()} variant="destructive" className="w-full">Sign Out</Button>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            <Link href="/login">
                                                <Button variant="outline" className="w-full">Sign In</Button>
                                            </Link>
                                            <Link href="/register">
                                                <Button className="w-full">Get Started</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
