"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryItem {
    _id: string;
    title: string;
    image: string;
    category: string;
}

export default function GalleryContent({ galleryItems }: { galleryItems: GalleryItem[] }) {
    const { t } = useLanguage();
    const categories = [t('galleryPage.all'), ...Array.from(new Set(galleryItems.map((item) => item.category)))];
    const [selectedCategory, setSelectedCategory] = useState(t('galleryPage.all'));

    const filteredItems =
        selectedCategory === t('galleryPage.all')
            ? galleryItems
            : galleryItems.filter((item) => item.category === selectedCategory);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="bg-muted/40 py-12 md:py-20">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('galleryPage.title')}</h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        {t('galleryPage.subtitle')}
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <div className="container mx-auto py-12 md:py-16 px-4">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category)}
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {galleryItems.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No items found in the gallery.
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                        {filteredItems.map((item) => (
                            <div key={item._id} className="group relative break-inside-avoid overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                                <div className="relative aspect-square w-full">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-6">
                                        <h3 className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/80 text-xs md:text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {item.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA */}
            <section className="bg-muted/20 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">{t('sections.ctaTitle')}</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t('sections.galleryDesc')}
                    </p>
                    <Link href="/contact">
                        <Button size="lg">{t('hero.contact')}</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
