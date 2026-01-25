"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
}

interface HeroSliderProps {
    slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (!slides || slides.length === 0) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black text-white">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                            {slide.title}
                        </h1>
                        {slide.subtitle && (
                            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl">
                                {slide.subtitle}
                            </p>
                        )}
                        <div className="flex gap-4">
                            <Link href="/services">
                                <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white border-none shadow-lg hover:scale-105 transition-transform">
                                    Our Services <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white hover:text-black shadow-lg hover:scale-105 transition-all">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
