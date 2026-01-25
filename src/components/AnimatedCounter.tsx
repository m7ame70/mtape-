"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    duration?: number;
}

export default function AnimatedCounter({ value, suffix = "", duration = 2000 }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let startTime: number | null = null;

                    const animate = (currentTime: number) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);

                        // Easing function for smooth animation (easeOutExpo)
                        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                        setCount(Math.floor(easeOut * value));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [value, duration]);

    return (
        <span ref={elementRef} className="tabular-nums">
            {count}{suffix}
        </span>
    );
}
