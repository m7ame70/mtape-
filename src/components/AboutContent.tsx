"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Printer, Star } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import CTASection from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutContent() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-muted/40 py-12 md:py-20">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('aboutPage.title')}</h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {t('aboutPage.subtitle')}
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-video md:aspect-square bg-muted rounded-xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1562613531-a08064906f23?q=80&w=1000&auto=format&fit=crop"
                                alt="Printing Process"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">{t('aboutPage.missionTitle')}</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t('aboutPage.missionDesc')}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('sections.aboutDesc1')}
                            </p>
                            <ul className="space-y-3 pt-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span>{t('sections.highQuality')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span>{t('sections.fastTurnaround')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                    <span>{t('sections.expertSupport')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold mb-2">
                                <AnimatedCounter value={15} suffix="+" />
                            </h3>
                            <p className="opacity-90">{t('stats.experience')}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold mb-2">
                                <AnimatedCounter value={5000} suffix="+" />
                            </h3>
                            <p className="opacity-90">{t('stats.clients')}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold mb-2">
                                <AnimatedCounter value={50} suffix="+" />
                            </h3>
                            <p className="opacity-90">{t('stats.awards')}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-bold mb-2">
                                <AnimatedCounter value={1} suffix="M+" />
                            </h3>
                            <p className="opacity-90">{t('stats.prints')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-12 md:py-20 bg-muted/20">
                <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
                    <h2 className="text-3xl font-bold">{t('aboutPage.storyTitle')}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {t('aboutPage.storyDesc')}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {t('sections.aboutDesc2')}
                    </p>
                </div>
            </section>

            <CTASection />
        </div>
    );
}
