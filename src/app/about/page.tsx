import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Users, History, Award, MessageCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-muted/30 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">Values & Vision</h1>
                    <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl">
                        More than just a printing house. We are your creative partners dedicated to bringing your brand's vision to physical reality.
                    </p>
                </div>
            </section>

            <div className="container mx-auto py-16 md:py-24 space-y-20">
                {/* Mission Section - 2 Col */}
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                            Our Mission
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Precision in Every Pixel, Quality in Every Print.</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Founded in 2010, PrintingHouse started with a single goal: to provide businesses with print materials that they can be proud of. We believe that physical touchpoints—business cards, brochures, signage—are vital in a digital world.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our team combines traditional craftsmanship with modern technology to deliver results that exceed expectations.
                        </p>

                        <div className="space-y-2 pt-4">
                            {["Eco-friendly materials", "Advanced color matching", "24/7 Production capability"].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-muted">
                        {/* Placeholder for About Image */}
                        <img
                            src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop"
                            alt="Printing Press"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y bg-muted/10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <History className="h-6 w-6" />
                        </div>
                        <h4 className="text-3xl font-bold">15+</h4>
                        <p className="text-sm text-muted-foreground font-medium">Years Experience</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <h4 className="text-3xl font-bold">5000+</h4>
                        <p className="text-sm text-muted-foreground font-medium">Happy Clients</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Award className="h-6 w-6" />
                        </div>
                        <h4 className="text-3xl font-bold">50+</h4>
                        <p className="text-sm text-muted-foreground font-medium">Awards Won</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Check className="h-6 w-6" />
                        </div>
                        <h4 className="text-3xl font-bold">1M+</h4>
                        <p className="text-sm text-muted-foreground font-medium">Prints Delivered</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold">Ready to work with us?</h2>
                    <p className="text-muted-foreground">Let's create something unmatched together.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="h-12 px-8">Get in Touch</Button>
                        </Link>
                        <a
                            href="https://wa.me/1234567890?text=Hello!%20I%20would%20like%20to%20inquire%20about%20your%20printing%20services."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="h-12 px-8 bg-[#25D366] hover:bg-[#20BA5A] text-white">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                WhatsApp Us
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
