"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Package, Settings, LogOut, Printer, Users, Image as ImageIcon, Menu, Star, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    const sidebarItems = [
        { href: "/admin", label: t('admin.overview'), icon: LayoutDashboard },
        { href: "/admin/services", label: t('admin.services'), icon: Package },
        { href: "/admin/messages", label: t('admin.messages'), icon: MessageSquare },
        { href: "/admin/gallery", label: t('admin.gallery'), icon: ImageIcon },
        { href: "/admin/hero", label: t('admin.hero'), icon: LayoutTemplate },
        { href: "/admin/testimonials", label: t('admin.testimonials'), icon: Star },
        { href: "/admin/users", label: t('admin.users'), icon: Users },
        { href: "/profile", label: t('admin.profile'), icon: Settings },
    ];

    return (
        <div className="flex min-h-screen flex-col md:flex-row overflow-x-hidden">
            <aside className="w-full md:w-64 border-r bg-background hidden md:block">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Printer className="h-6 w-6" />
                        <span className="">{t('admin.adminTitle')}</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        pathname === item.href
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('admin.signOut')}
                    </Button>
                </div>
            </aside>

            <div className="flex flex-col flex-1 min-w-0">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-6">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-2 font-semibold mb-6">
                                    <Printer className="h-6 w-6" />
                                    <span>{t('admin.adminTitle')}</span>
                                </div>
                                <nav className="grid gap-2 flex-1">
                                    {sidebarItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    pathname === item.href
                                                        ? "bg-muted text-primary"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="mt-auto pt-4 border-t">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        {t('admin.signOut')}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Printer className="h-6 w-6" />
                        <span>{t('admin.adminTitle')}</span>
                    </Link>
                </header>
                <main className="flex-1 p-4 lg:gap-6 lg:p-6 bg-background overflow-x-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
