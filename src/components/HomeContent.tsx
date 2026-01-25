"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Printer, Star, MessageCircle } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import CTASection from "@/components/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceType {
    _id: string;
    title: string;
    description: string;
    image: string;
    price?: number;
}

interface HeroSlide {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
}

interface HomeContentProps {
    services: ServiceType[];
    galleryItems: any[];
    heroSlides: HeroSlide[];
}

export default function HomeContent({ services, galleryItems, heroSlides }: HomeContentProps) {
    const { t, direction } = useLanguage();
    const isRtl = direction === 'rtl';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {heroSlides.length > 0 ? (
                <HeroSlider slides={heroSlides} />
            ) : (
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/10 to-background flex justify-center">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    {t('hero.title')}
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    {t('hero.subtitle')}
                                </p>
                            </div>
                            <div className="space-x-4 flex gap-4">
                                <Link href="/services">
                                    <Button size="lg" className="h-11 shadow-lg hover:shadow-xl transition-all">
                                        {t('hero.explore')} <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'rotate-180 mr-2 ml-0' : ''}`} />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg" className="h-11">
                                        {t('hero.contact')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Services Preview Section */}
            {services.length > 0 && (
                <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('sections.popularServices')}</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    {t('sections.popularServicesDesc')}
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {services.map((service) => (
                                <div key={service._id} className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-muted hover:-translate-y-1">
                                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                                        <img
                                            src={service.image || "https://placehold.co/600x400?text=Service"}
                                            alt={service.title}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-300" />
                                        {service.price && (
                                            <Badge className="absolute top-3 right-3 bg-white/90 text-black shadow-sm backdrop-blur-md hover:bg-white text-xs font-bold px-2 py-0.5 pointer-events-none">
                                                ${service.price}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col gap-3">
                                        <h3 className="font-bold text-xl tracking-tight text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed h-10">
                                            {service.description}
                                        </p>

                                        <div className="pt-2 mt-auto">
                                            <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="block">
                                                <Button className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white font-semibold transition-all duration-300 border-primary/20 border hover:border-transparent group/btn">
                                                    {t('common.requestQuote')}
                                                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 ${isRtl ? 'rotate-180 mr-2 ml-0 group-hover/btn:-translate-x-1' : ''}`} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href="/services">
                                <Button size="lg" variant="secondary">{t('common.viewAll')}</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Preview Section */}
            {galleryItems.length > 0 && (
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20 flex justify-center">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('sections.gallery')}</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    {t('sections.galleryDesc')}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {galleryItems.slice(0, 8).map((item: any) => (
                                <div key={item._id} className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                                    <div className="relative w-full h-full">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                                            {item.category && (
                                                <p className="text-xs text-white/80">{item.category}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href="/gallery">
                                <Button size="lg" variant="secondary">{t('common.viewAll')}</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* About Us Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex justify-center">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div className="space-y-6">
                            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                                {t('sections.about')}
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                {t('sections.aboutTitle')}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t('sections.aboutDesc1')}
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {t('sections.aboutDesc2')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/about">
                                    <Button size="lg" variant="default">
                                        {t('sections.learnMore')}
                                        <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'rotate-180 mr-2 ml-0' : ''}`} />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline">
                                        {t('hero.contact')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-primary/5 p-6 rounded-xl border">
                                    <h3 className="text-4xl font-bold text-primary mb-2">
                                        <AnimatedCounter value={15} suffix="+" />
                                    </h3>
                                    <p className="text-muted-foreground">{t('stats.experience')}</p>
                                </div>
                                <div className="bg-primary/5 p-6 rounded-xl border">
                                    <h3 className="text-4xl font-bold text-primary mb-2">
                                        <AnimatedCounter value={5000} suffix="+" />
                                    </h3>
                                    <p className="text-muted-foreground">{t('stats.clients')}</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-primary/5 p-6 rounded-xl border">
                                    <h3 className="text-4xl font-bold text-primary mb-2">
                                        <AnimatedCounter value={50} suffix="+" />
                                    </h3>
                                    <p className="text-muted-foreground">{t('stats.awards')}</p>
                                </div>
                                <div className="bg-primary/5 p-6 rounded-xl border">
                                    <h3 className="text-4xl font-bold text-primary mb-2">
                                        <AnimatedCounter value={1} suffix="M+" />
                                    </h3>
                                    <p className="text-muted-foreground">{t('stats.prints')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 flex justify-center">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('sections.features')}</h2>
                        <p className="max-w-[700px] text-muted-foreground">{t('sections.aboutDesc2')}</p>
                    </div>
                    <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
                        <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Printer className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">{t('sections.highQuality')}</h3>
                            <p className="text-muted-foreground">
                                {t('sections.popularServicesDesc')}
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <CheckCircle className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">{t('sections.fastTurnaround')}</h3>
                            <p className="text-muted-foreground">
                                {t('sections.popularServicesDesc')}
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4 text-center p-6 bg-background rounded-xl shadow-sm border">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Star className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">{t('sections.expertSupport')}</h3>
                            <p className="text-muted-foreground">
                                {t('sections.aboutDesc1')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialsSlider />

            {/* CTA Section */}
            <CTASection />
        </div>
    );
}
