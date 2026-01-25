"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceType {
    _id: string;
    title: string;
    description: string;
    image: string;
    price?: number;
}

export default function ServicesContent({ services }: { services: ServiceType[] }) {
    const { t, direction } = useLanguage();
    const isRtl = direction === 'rtl';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-muted/40 py-12 md:py-20">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('servicesPage.title')}</h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {t('servicesPage.subtitle')}
                    </p>
                </div>
            </section>

            <div className="container mx-auto py-12 md:py-16 px-4">
                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="p-6 bg-muted rounded-full">
                            <span className="text-4xl">📭</span>
                        </div>
                        <h3 className="text-xl font-semibold">No services found</h3>
                        <p className="text-muted-foreground">Please check back later or contact us for custom requests.</p>
                        <Link href="/contact">
                            <Button variant="outline">{t('hero.contact')}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
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
                )}
            </div>

            <section className="bg-primary text-primary-foreground py-12 md:py-16">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">{t('sections.ctaTitle')}</h2>
                        <p className="opacity-90">{t('sections.ctaDesc')}</p>
                    </div>
                    <Link href="/contact">
                        <Button size="lg" variant="secondary" className="min-w-[150px]">{t('hero.contact')}</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
