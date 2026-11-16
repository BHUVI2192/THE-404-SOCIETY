import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseCircleTransitionProps {
    path: string;
    duration?: number; // in seconds
    delay?: number; // in seconds (before navigation/transition end)
}

export const useCircleTransition = ({ path, duration = 0.8, delay = 0 }: UseCircleTransitionProps) => {
    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [maskStyle, setMaskStyle] = useState<React.CSSProperties>({
        opacity: 0,
        transform: 'scale(0)',
    });

    const triggerTransition = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!buttonRef.current) return;

        setIsTransitioning(true);

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();

        // Calculate center of the button
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Determine the radius needed to cover the screen
        // Distance to the farthest corner
        const distanceToTL = Math.hypot(centerX, centerY);
        const distanceToTR = Math.hypot(window.innerWidth - centerX, centerY);
        const distanceToBL = Math.hypot(centerX, window.innerHeight - centerY);
        const distanceToBR = Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY);

        const maxRadius = Math.max(distanceToTL, distanceToTR, distanceToBL, distanceToBR);

        // Initial size (button size roughly) to Final size (2x max radius to cover corners)
        // We'll use a fixed circle size initially and scale it
        const initialSize = Math.max(rect.width, rect.height);
        const scale = (maxRadius * 2) / initialSize;

        // Set initial state (centered on button)
        setMaskStyle({
            position: 'fixed',
            top: centerY - initialSize / 2,
            left: centerX - initialSize / 2,
            width: initialSize,
            height: initialSize,
            borderRadius: '9999px',
            backgroundColor: '#171717', // neutral-900 hardcoded or could be prop
            zIndex: 9999, // Above everything
            pointerEvents: 'none',
            opacity: 1,
            transform: 'scale(1)',
            transition: `transform ${duration}s ease-in-out`,
        });

        // Trigger animation in next frame
        requestAnimationFrame(() => {
            setMaskStyle((prev) => ({
                ...prev,
                transform: `scale(${scale})`,
            }));
        });

        // Navigate after animation
        const timeoutId = setTimeout(() => {
            navigate(path);
        }, (duration * 1000) + (delay * 1000));

        return () => clearTimeout(timeoutId);
    };

    return {
        buttonRef,
        isTransitioning,
        triggerTransition,
        maskStyle
    };
};
