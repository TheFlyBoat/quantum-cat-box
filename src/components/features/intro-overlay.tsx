'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, RotateCcw, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingModal } from '@/components/features/onboarding-modal';
import { playFeedback } from '@/lib/audio';

interface IntroOverlayProps {
    onComplete: () => void;
}

const emptySubscribe = () => () => {};

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
    const isMounted = React.useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const [isVideoEnded, setIsVideoEnded] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [showUnmuteHint, setShowUnmuteHint] = React.useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

    const videoRef = React.useRef<HTMLVideoElement>(null);

    // Attempt unmuted autoplay, handle browser autoplay restrictions gracefully
    React.useEffect(() => {
        const video = videoRef.current;
        if (!video || isVideoEnded) return;

        video.muted = false;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Browser blocked unmuted autoplay, fallback to muted with an unmute prompt
                video.muted = true;
                setIsMuted(true);
                setShowUnmuteHint(true);
                video.play().catch((e) => console.error('Video autoplay error:', e));
            });
        }
    }, [isVideoEnded]);

    const handleVideoEnded = () => {
        setIsVideoEnded(true);
    };

    const handleSkip = () => {
        playFeedback('click-2');
        if (videoRef.current) {
            videoRef.current.pause();
        }
        setIsVideoEnded(true);
    };

    const handleToggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        const newMuted = !video.muted;
        video.muted = newMuted;
        setIsMuted(newMuted);
        if (!newMuted) {
            setShowUnmuteHint(false);
        }
    };

    const handleUnmutePrompt = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = false;
        setIsMuted(false);
        setShowUnmuteHint(false);
    };

    const handleHowToPlay = () => {
        playFeedback('click-3');
        setIsOnboardingOpen(true);
    };

    const handleEnter = () => {
        playFeedback('click-1');
        onComplete();
    };

    const handleReplay = () => {
        playFeedback('click-3');
        setIsVideoEnded(false);
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch((e) => console.error('Video replay error:', e));
        }
    };

    if (!isMounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white overflow-y-auto p-4 sm:p-8 select-none">
            {/* Cosmic Purple & Blue Background Styling */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(76,29,149,0.5)_0%,_rgba(15,23,42,0.85)_50%,_#020617_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 pointer-events-none" />

            {/* Cosmic Ambient Glows */}
            <div
                className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-[#A240FF]/25 blur-[120px] pointer-events-none animate-pulse"
                style={{ animationDuration: '6000ms' }}
            />
            <div
                className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-[#3696C9]/25 blur-[120px] pointer-events-none animate-pulse"
                style={{ animationDuration: '7000ms' }}
            />

            {/* Main Content Area */}
            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-2 my-auto">
                {!isVideoEnded ? (
                    <div className="w-full flex flex-col items-center">
                        {/* Large Video Container */}
                        <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-purple-500/40 shadow-[0_0_60px_rgba(162,64,255,0.35)] bg-black flex items-center justify-center">
                            <video
                                ref={videoRef}
                                src="/intro.mp4"
                                playsInline
                                autoPlay
                                className="w-full h-full object-contain sm:object-cover"
                                onEnded={handleVideoEnded}
                            />

                            {/* Sound Toggle Button */}
                            <button
                                type="button"
                                onClick={handleToggleMute}
                                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/80 transition-all shadow-lg"
                            >
                                {isMuted ? (
                                    <>
                                        <VolumeX className="h-4 w-4 text-pink-400" />
                                        <span className="hidden sm:inline">Muted</span>
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="h-4 w-4 text-emerald-400" />
                                        <span className="hidden sm:inline">Sound On</span>
                                    </>
                                )}
                            </button>

                            {/* Unmute Prompt (if browser blocked unmuted autoplay) */}
                            {showUnmuteHint && (
                                <button
                                    type="button"
                                    onClick={handleUnmutePrompt}
                                    className="absolute bottom-5 left-5 z-20 flex items-center gap-2 rounded-full bg-[#A240FF]/90 hover:bg-[#A240FF] px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all animate-bounce"
                                >
                                    <Volume2 className="h-4 w-4" />
                                    <span>Tap for Sound 🔊</span>
                                </button>
                            )}
                        </div>

                        {/* Skip Button Under Video */}
                        <div className="mt-5 flex items-center justify-center">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleSkip}
                                className="rounded-full px-8 py-2 text-sm font-semibold tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            >
                                Skip
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* End Screen: Three Buttons replacing the video */
                    <div className="w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-slate-900/85 backdrop-blur-xl p-8 sm:p-12 text-center shadow-[0_0_60px_rgba(162,64,255,0.3)] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#A240FF]/30 to-[#3696C9]/30 border border-white/15 shadow-inner">
                            <Sparkles className="h-8 w-8 text-pink-300" />
                        </div>

                        <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
                            The Quantum Realm Awaits
                        </h2>
                        <p className="text-sm sm:text-base text-purple-200/80 max-w-md mx-auto mb-8 leading-relaxed font-body">
                            Step inside to collapse your daily superposition, reveal your feline fortune, and collect across the multiverse.
                        </p>

                        {/* Three Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-lg">
                            {/* 1. How to Play (opens current onboarding) */}
                            <Button
                                type="button"
                                onClick={handleHowToPlay}
                                className="w-full sm:flex-1 h-auto py-3.5 px-4 rounded-2xl border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
                            >
                                <HelpCircle className="h-5 w-5 text-[#3696C9]" />
                                <span>How to Play</span>
                            </Button>

                            {/* 2. Enter (to enter the app) */}
                            <Button
                                type="button"
                                onClick={handleEnter}
                                className="w-full sm:flex-1 h-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#A240FF] via-[#FF809F] to-[#3696C9] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(162,64,255,0.5)] hover:opacity-95 hover:scale-105 transition-all order-first sm:order-none"
                            >
                                <span>Enter</span>
                                <ArrowRight className="h-5 w-5" />
                            </Button>

                            {/* 3. Replay (to replay the video) */}
                            <Button
                                type="button"
                                onClick={handleReplay}
                                className="w-full sm:flex-1 h-auto py-3.5 px-4 rounded-2xl border border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
                            >
                                <RotateCcw className="h-5 w-5 text-[#A240FF]" />
                                <span>Replay</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Current Onboarding Modal (opened when user taps How to Play) */}
            <OnboardingModal
                open={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
            />
        </div>,
        document.body
    );
}
