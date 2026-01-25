"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedCounter from "@/components/AnimatedCounter";

interface Service {
    _id: string;
    title: string;
}

export default function ContactContent() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        // Fetch services for the dropdown
        async function fetchServices() {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error('Failed to fetch services');
            }
        }
        fetchServices();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success(t('contactPage.success'));
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(t('contactPage.error'));
            }
        } catch (error) {
            toast.error(t('contactPage.error'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-muted/40 py-12 md:py-20">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('contactPage.title')}</h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {t('contactPage.subtitle')}
                    </p>
                </div>
            </section>

            <div className="container mx-auto py-12 md:py-16 px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info - Order 2 on mobile, 1 on desktop */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">{t('contactPage.infoTitle')}</h2>
                            <p className="text-muted-foreground mb-8">
                                {t('sections.ctaDesc')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-card">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t('footer.contact')}</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-card">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t('auth.email')}</h3>
                                        <p className="text-muted-foreground">info@printinghouse.com</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-card">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{t('contactPage.title')}</h3>
                                        <p className="text-muted-foreground">123 Print Street, Design City</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form - Order 1 on mobile, 2 on desktop */}
                    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border order-1 lg:order-2">
                        <h2 className="text-2xl font-bold mb-6">{t('contactPage.getInTouch')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('contactPage.name')}</Label>
                                <Input id="name" name="name" required placeholder={t('contactPage.name')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('contactPage.email')}</Label>
                                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">{t('admin.phone')}</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="+1 (555) 123-4567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service">{t('nav.services')} ({t('contactPage.subject')})</Label>
                                <select
                                    id="service"
                                    name="service"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">{t('contactPage.subject')}</option>
                                    {services.map((service) => (
                                        <option key={service._id} value={service.title}>
                                            {service.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">{t('contactPage.message')}</Label>
                                <Textarea id="message" name="message" required className="min-h-[150px]" placeholder={t('contactPage.message')} />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('contactPage.sending')}
                                    </>
                                ) : (
                                    <>
                                        {t('contactPage.send')}
                                        <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            {/* Quick Contact Buttons */}
                            <div className="pt-6 border-t">
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    {t('contactPage.subtitle')}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/1234567890?text=Hello!%20I%20would%20like%20to%20inquire%20about%20your%20printing%20services."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button
                                            type="button"
                                            size="lg"
                                            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                                        >
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            {t('sections.chatWhatsapp')}
                                        </Button>
                                    </a>

                                    {/* Call */}
                                    <a href="tel:+15551234567" className="w-full">
                                        <Button
                                            type="button"
                                            size="lg"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Phone className="mr-2 h-4 w-4" />
                                            {t('sections.callUs')}
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="w-full py-12 md:py-16 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-card p-6 rounded-xl border shadow-sm text-center hover:shadow-lg transition-shadow">
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                <AnimatedCounter value={15} suffix="+" />
                            </h3>
                            <p className="text-muted-foreground text-sm">{t('stats.experience')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm text-center hover:shadow-lg transition-shadow">
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                <AnimatedCounter value={5000} suffix="+" />
                            </h3>
                            <p className="text-muted-foreground text-sm">{t('stats.clients')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm text-center hover:shadow-lg transition-shadow">
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                <AnimatedCounter value={50} suffix="+" />
                            </h3>
                            <p className="text-muted-foreground text-sm">{t('stats.awards')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border shadow-sm text-center hover:shadow-lg transition-shadow">
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                <AnimatedCounter value={1} suffix="M+" />
                            </h3>
                            <p className="text-muted-foreground text-sm">{t('stats.prints')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
