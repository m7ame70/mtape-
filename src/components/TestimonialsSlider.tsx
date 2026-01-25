'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
    _id: string;
    name: string;
    position: string;
    company?: string;
    content: string;
    rating: number;
    image?: string;
}

export default function TestimonialsSlider() {
    const { t, direction } = useLanguage();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Auto-play
    useEffect(() => {
        if (testimonials.length <= 3) return; // Don't auto-play if no scroll needed

        const timer = setInterval(() => {
            if (!isAnimating) {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length, isAnimating]);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials');
        }
    };

    if (testimonials.length === 0) {
        return null;
    }

    const itemsToShow = 3;

    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (currentIndex + i) % testimonials.length;
            visible.push(testimonials[index]);
        }
        return visible;
    };

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const goToPrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const visibleTestimonials = getVisibleTestimonials();

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background flex justify-center overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                        Testimonials
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Clients Say</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {visibleTestimonials.map((testimonial, idx) => (
                            <Card
                                key={`${testimonial._id}-${currentIndex}-${idx}`}
                                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col space-y-4">
                                        {/* Quote Icon */}
                                        <div className="flex items-center justify-between">
                                            <Quote className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 transition-all ${i < testimonial.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-200 text-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 min-h-[5rem]">
                                            "{testimonial.content}"
                                        </p>

                                        {/* Author Info */}
                                        <div className="flex items-center gap-3 pt-3 border-t">
                                            {testimonial.image ? (
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                                                    <span className="text-base font-bold text-primary">
                                                        {testimonial.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-left flex-1">
                                                <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {testimonial.position}
                                                    {testimonial.company && ` • ${testimonial.company}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation */}
                    {testimonials.length > itemsToShow && (
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goToPrevious}
                                disabled={isAnimating}
                                className="rounded-full h-10 w-10 border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <div className="flex gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!isAnimating) {
                                                setIsAnimating(true);
                                                setCurrentIndex(index);
                                                setTimeout(() => setIsAnimating(false), 300);
                                            }
                                        }}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'w-8 bg-primary'
                                            : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goToNext}
                                disabled={isAnimating}
                                className="rounded-full h-10 w-10 border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
