import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import HomeContent from "@/components/HomeContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Printer, Star, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TestimonialsSlider from "@/components/TestimonialsSlider";

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
}

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/services`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : []; // Limit to 3 for home page
  } catch (error) {
    console.error("Failed to fetch services", error);
    return [];
  }
}

async function getGalleryItems() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/gallery`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 6) : []; // Limit to 6 for home page
  } catch (error) {
    console.error("Failed to fetch gallery", error);
    return [];
  }
}

async function getHeroSlides() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/hero`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch hero slides", error);
    return [];
  }
}

export default async function Home() {
  const services: ServiceType[] = await getServices();
  const galleryItems = await getGalleryItems();
  const heroSlides = await getHeroSlides();

  return (
    <HomeContent
      services={services || []}
      galleryItems={galleryItems || []}
      heroSlides={heroSlides || []}
    />
  );
}
