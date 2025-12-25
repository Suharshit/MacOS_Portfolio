import React, { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const containerRef = useRef(null);

    // Dynamic font size based on viewport width
    const [titleFontSize, setTitleFontSize] = useState('8rem');
    const [subtitleFontSize, setSubtitleFontSize] = useState('1.875rem');

    // Calculate responsive font sizes based on viewport
    useEffect(() => {
        const calculateFontSize = () => {
            const vw = window.innerWidth;
            // Title: scales from 4rem at 480px to 10rem at 1920px
            const titleSize = Math.max(4, Math.min(10, vw / 192));
            // Subtitle: scales from 1rem at 480px to 2rem at 1920px
            const subtitleSize = Math.max(1, Math.min(2, vw / 960));

            setTitleFontSize(`${titleSize}rem`);
            setSubtitleFontSize(`${subtitleSize}rem`);
        };

        calculateFontSize();
        window.addEventListener('resize', calculateFontSize);
        return () => window.removeEventListener('resize', calculateFontSize);
    }, []);

    // GSAP hover animation for individual character bold effect with adjacent chars
    // Improved: kills existing animations and uses smoother transitions without scale
    const handleCharHover = useCallback((e) => {
        const char = e.target;
        const parent = char.parentElement;
        const chars = Array.from(parent.querySelectorAll('.char'));
        const index = chars.indexOf(char);

        // Kill any existing animations on affected characters to prevent conflicts
        const affectedChars = [
            chars[index - 2],
            chars[index - 1],
            char,
            chars[index + 1],
            chars[index + 2]
        ].filter(Boolean);

        affectedChars.forEach(c => gsap.killTweensOf(c));

        // Animate main character - no scale, just font weight for smooth effect
        gsap.to(char, {
            fontVariationSettings: "'wght' 900",
            duration: 0.25,
            ease: "power2.out",
            overwrite: true,
        });

        // Animate adjacent characters (1 on each side)
        const prevChar = chars[index - 1];
        const nextChar = chars[index + 1];

        if (prevChar) {
            gsap.to(prevChar, {
                fontVariationSettings: "'wght' 700",
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        }

        if (nextChar) {
            gsap.to(nextChar, {
                fontVariationSettings: "'wght' 700",
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        }

        // Animate outer adjacent characters (2 away from main)
        const prevPrevChar = chars[index - 2];
        const nextNextChar = chars[index + 2];

        if (prevPrevChar) {
            gsap.to(prevPrevChar, {
                fontVariationSettings: "'wght' 550",
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        }

        if (nextNextChar) {
            gsap.to(nextNextChar, {
                fontVariationSettings: "'wght' 550",
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        }
    }, []);

    const handleCharLeave = useCallback((e) => {
        const char = e.target;
        const parent = char.parentElement;
        const chars = Array.from(parent.querySelectorAll('.char'));
        const index = chars.indexOf(char);
        const baseWeight = char.dataset.baseWeight || 400;

        // Kill any existing animations on affected characters
        const affectedChars = [
            chars[index - 2],
            chars[index - 1],
            char,
            chars[index + 1],
            chars[index + 2]
        ].filter(Boolean);

        affectedChars.forEach(c => gsap.killTweensOf(c));

        // Reset main character with smooth transition
        gsap.to(char, {
            fontVariationSettings: `'wght' ${baseWeight}`,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
        });

        // Reset adjacent characters
        [-2, -1, 1, 2].forEach(offset => {
            const adjacentChar = chars[index + offset];
            if (adjacentChar) {
                const adjBaseWeight = adjacentChar.dataset.baseWeight || 400;
                gsap.to(adjacentChar, {
                    fontVariationSettings: `'wght' ${adjBaseWeight}`,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: true,
                });
            }
        });
    }, []);

    // Render text with individual character spans for animation
    const renderText = useCallback((text, className, baseWeight = 400, fontSize = null) => {
        return [...text].map((char, i) => (
            <span
                key={i}
                className={`char ${className}`}
                data-base-weight={baseWeight}
                style={{
                    fontVariationSettings: `'wght' ${baseWeight}`,
                    display: 'inline-block',
                    opacity: 0,
                    cursor: 'default',
                    transition: 'transform 0.1s ease',
                    ...(fontSize && { fontSize }),
                }}
                onMouseEnter={handleCharHover}
                onMouseLeave={handleCharLeave}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    }, [handleCharHover, handleCharLeave]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Create timeline for sequenced entrance animations
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Animate subtitle characters from below
            tl.to(subtitleRef.current.querySelectorAll('.char'), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.02,
            });

            // Set initial state for subtitle chars
            gsap.set(subtitleRef.current.querySelectorAll('.char'), {
                y: 20,
            });

            // Set initial state for title chars
            gsap.set(titleRef.current.querySelectorAll('.char'), {
                y: 50,
            });

            // Animate title characters from below
            tl.to(titleRef.current.querySelectorAll('.char'), {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.05,
            }, "-=0.3");

            // Animate font weight variation on title for entrance
            tl.to(titleRef.current.querySelectorAll('.char'), {
                fontVariationSettings: "'wght' 700",
                duration: 0.8,
                stagger: 0.05,
                onComplete: () => {
                    // After entrance animation, set base weight for hover effect
                    titleRef.current.querySelectorAll('.char').forEach((char) => {
                        char.dataset.baseWeight = 700;
                    });
                }
            }, "-=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="welcome" ref={containerRef}>
            <p ref={subtitleRef}>
                {renderText("Hey, I'm Suharshit! Welcome to my", "text-3xl font-georama", 200)}
            </p>
            <h1 ref={titleRef} className="mt-7">
                {renderText("Portfolio", "italic font-georama", 400, titleFontSize)}
            </h1>
            <div className="small-screen">
                <p>This Portfolio is designed for desktop/tablet screens only.</p>
            </div>
        </section>
    )
}

export default Welcome