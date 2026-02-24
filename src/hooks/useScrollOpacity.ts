import { useState, useEffect, RefObject } from 'react';

interface ScrollOpacityOptions {
    enterStart?: number; // 0 to 1 (fraction of viewport height)
    enterEnd?: number;   // 0 to 1
    exitStart?: number;  // 0 to 1
    exitEnd?: number;    // 0 to 1
}

export const useScrollOpacity = (
    ref: RefObject<HTMLElement>,
    options: ScrollOpacityOptions = {}
) => {
    const [opacity, setOpacity] = useState(0);

    const {
        enterStart = 1.0, // Start fading in when top is at bottom of viewport
        enterEnd = 0.5,   // Fully visible when top is at middle of viewport
        exitStart = -1,    // Disable fade out by default
        exitEnd = -1
    } = options;

    useEffect(() => {
        let animationFrameId: number;

        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress based on thresholds
            // Enter phase: rect.top goes from viewportHeight (1.0) -> viewportHeight * 0.5 (0.5)
            // Progress 0 when rect.top >= enterStart * vH
            // Progress 1 when rect.top <= enterEnd * vH

            const startPx = enterStart * viewportHeight;
            const endPx = enterEnd * viewportHeight;

            let newOpacity = 0;

            if (rect.top > startPx) {
                newOpacity = 0;
            } else if (rect.top <= endPx) {
                newOpacity = 1;

                // Check for exit phase if enabled
                if (exitStart !== -1 && exitEnd !== -1) {
                    const exitStartPx = exitStart * viewportHeight;
                    const exitEndPx = exitEnd * viewportHeight;

                    if (rect.top < exitStartPx) {
                        // Fading out
                        // Progress 1 when rect.top = exitStartPx
                        // Progress 0 when rect.top = exitEndPx
                        const exitProgress = (rect.top - exitEndPx) / (exitStartPx - exitEndPx);
                        newOpacity = Math.max(0, Math.min(1, exitProgress));
                    }
                }

            } else {
                // Fading in
                const progress = (startPx - rect.top) / (startPx - endPx);
                newOpacity = Math.max(0, Math.min(1, progress));
            }

            setOpacity(newOpacity);
            animationFrameId = requestAnimationFrame(handleScroll); // Re-run next frame
        };

        // Initial check
        handleScroll();

        // We use a single scroll listener, or actually, to avoid thrashing,
        // we can just loop in RAF if we want super smoothness, but standard event + RAF throttling is better for battery.
        // Let's use the event listener that calls RAF, but prevent stacking.

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [ref, enterStart, enterEnd, exitStart, exitEnd]);

    return opacity;
};
