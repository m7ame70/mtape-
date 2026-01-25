"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTASection() {
    const { t, direction } = useLanguage();

    return (
        <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-primary z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
                {/* Floating Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 text-center text-primary-foreground">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-sm">
                        {t('sections.ctaTitle')}
                    </h2>
                    <p className="text-lg md:text-xl text-primary-foreground/90 max-w-[600px] mx-auto leading-relaxed">
                        {t('sections.ctaDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        {/* Get Quote */}
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button size="lg" variant="secondary" className="w-full sm:min-w-[160px] h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                {t('sections.getQuote')}
                                {direction === 'ltr' ? <ArrowRight className="ml-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4 rotate-180" />}
                            </Button>
                        </Link>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/1234567890?text=Hello!%20I%20would%20like%20to%20inquire%20about%20your%20printing%20services."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        >
                            <Button size="lg" className="w-full sm:min-w-[160px] h-12 text-base font-semibold bg-[#25D366] hover:bg-[#20BA5A] text-white border-none shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                <MessageCircle className={direction === 'ltr' ? "mr-2 h-5 w-5" : "ml-2 h-5 w-5"} />
                                {t('sections.chatWhatsapp')}
                            </Button>
                        </a>

                        {/* Call Us */}
                        <a href="tel:+15551234567" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:min-w-[160px] h-12 text-base font-semibold bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                <Phone className={direction === 'ltr' ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                                {t('sections.callUs')}
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
