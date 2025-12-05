'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Box, BookOpen, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Reusing the visual style from the Splash Screen
import { QuantumCat } from '@/components/splash-screen';

interface OracleIntroProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 'welcome',
        title: 'The Void Awaits',
        body: 'Welcome, seeker. You have found the Quantum Box. Inside lies chaos, order, and infinite possibility.',
        icon: Sparkles,
    },
    {
        id: 'box',
        title: 'Reveal Your Destiny',
        body: 'Each day, open the box to collapse the quantum state. Will your cat be Alive? Dead? Or a Paradox?',
        icon: Box,
    },
    {
        id: 'collection',
        title: 'Collect the Unknown',
        body: 'Discover rare cats and unlock the secrets of the universe. Your gallery is your grimoire.',
        icon: BookOpen,
    },
    {
        id: 'oracle',
        title: 'Heed the Oracle',
        body: 'With every reveal comes a message. A fortune. A warning. Listen closely to what the universe whispers.',
        icon: Star,
    },
];

export function OracleIntro({ onComplete }: OracleIntroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            onComplete();
        } else {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4c1d95_0%,#0f172a_60%,#020617_100%)] opacity-80" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 animate-pulse" />
            
            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 h-1 w-1 rounded-full bg-purple-400 blur-[1px] animate-bounce duration-[3000ms]" />
            <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-blue-400 blur-[1px] animate-bounce duration-[4000ms]" />

            {/* Main Content Container */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
                
                {/* Animated Cat Header */}
                <div className="mb-8 scale-75 transform transition-transform duration-700">
                     <div className="relative h-32 w-32 flex items-center justify-center">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
                        <QuantumCat animate={true} className="h-full w-full" />
                     </div>
                </div>

                {/* Slide Content */}
                <div className="relative min-h-[240px] w-full">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentSlide.id}
                            initial={{ opacity: 0, x: direction * 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction * -50 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute inset-0 flex flex-col items-center"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                                <currentSlide.icon className="h-8 w-8 text-purple-200" />
                            </div>
                            
                            <h2 className="mb-4 font-headline text-4xl font-bold tracking-wide text-white drop-shadow-lg">
                                {currentSlide.title}
                            </h2>
                            
                            <p className="font-fortune text-xl leading-relaxed text-purple-100/80 max-w-[85%]">
                                {currentSlide.body}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex w-full flex-col items-center gap-8">
                    {/* Progress Dots */}
                    <div className="flex gap-3">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    idx === currentIndex 
                                        ? "w-8 bg-gradient-to-r from-purple-400 to-pink-400" 
                                        : "w-2 bg-white/20"
                                )}
                            />
                        ))}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleNext}
                        className="group relative flex items-center gap-3 rounded-full bg-white px-8 py-4 font-headline text-xl font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                    >
                        <span>{currentIndex === slides.length - 1 ? 'Begin Destiny' : 'Continue'}</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
