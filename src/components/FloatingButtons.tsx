'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';

export default function FloatingButtons() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openWhatsApp = () => {
        // Replace with your actual WhatsApp number (format: country code + number, no + or spaces)
        const phoneNumber = '1234567890'; // Example: 1234567890
        const message = encodeURIComponent('Hello! I would like to inquire about your printing services.');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const callPhone = () => {
        window.location.href = 'tel:+15551234567';
    };

    return (
        <>
            {/* Right Side - Contact Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {/* Call Button */}
                <button
                    onClick={callPhone}
                    className="group relative bg-[#007AFF] hover:bg-[#0056cc] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Call us"
                >
                    <Phone className="w-6 h-6" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Call Us
                    </span>
                </button>

                {/* WhatsApp Button */}
                <button
                    onClick={openWhatsApp}
                    className="group relative bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Contact us on WhatsApp"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat on WhatsApp
                    </span>
                </button>
            </div>

            {/* Left Side - Scroll to Top */}
            {showScrollTop && (
                <div className="fixed bottom-6 left-6 z-50">
                    <button
                        onClick={scrollToTop}
                        className="group relative bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-5"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6" />
                        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Back to Top
                        </span>
                    </button>
                </div>
            )}
        </>
    );
}
