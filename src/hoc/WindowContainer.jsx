import React, { useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { useWindowStore } from '#store';

/**
 * WindowContainer - Reusable wrapper for all macOS-style windows
 * Provides: draggable header, window controls (close/minimize/maximize), z-index management
 * 
 * @param {string} windowId - Unique identifier for this window (finder, safari, etc.)
 * @param {string} title - Window title displayed in header
 * @param {React.ReactNode} children - Window content
 * @param {string} className - Additional CSS classes for the window
 * @param {object} initialPosition - Initial {x, y} position (optional, defaults to centered)
 * @param {boolean} showControls - Whether to show window control buttons (default: true)
 */
const WindowContainer = ({
    windowId,
    title,
    children,
    className = '',
    initialPosition = null,
    showControls = true,
}) => {
    const { windows, closeWindow, bringToFront, minimizeWindow, toggleMaximize } = useWindowStore();
    const windowState = windows[windowId];

    // Track viewport size for responsive positioning
    const [viewportSize, setViewportSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080
    });

    // Drag state - ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURN
    const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [preMaximizePosition, setPreMaximizePosition] = useState({ x: 0, y: 0 });
    const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
    const windowRef = useRef(null);
    const prevViewportRef = useRef({ width: viewportSize.width, height: viewportSize.height });

    // Handle viewport resize - adjust window positions proportionally
    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            // Calculate scale factors
            const widthRatio = newWidth / prevViewportRef.current.width;
            const heightRatio = newHeight / prevViewportRef.current.height;

            // Only adjust if we have a meaningful ratio (prevents issues on initial load)
            if (widthRatio > 0 && widthRatio < 10 && heightRatio > 0 && heightRatio < 10) {
                setPosition(prev => ({
                    x: prev.x * widthRatio,
                    y: prev.y * heightRatio
                }));
            }

            prevViewportRef.current = { width: newWidth, height: newHeight };
            setViewportSize({ width: newWidth, height: newHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle mouse down on header - start dragging
    const handleMouseDown = useCallback((e) => {
        // Only drag from header, not from controls
        if (e.target.closest('#window-controls')) return;

        // Don't allow dragging when maximized
        if (windowState?.isMaximized) return;

        setIsDragging(true);
        bringToFront(windowId);

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y,
        };

        e.preventDefault();
    }, [position, bringToFront, windowId, windowState?.isMaximized]);

    // Handle mouse move - update position with viewport bounds
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;

        let newX = dragRef.current.initialX + deltaX;
        let newY = dragRef.current.initialY + deltaY;

        // Get window dimensions for bounds calculation
        const windowEl = windowRef.current;
        if (windowEl) {
            const rect = windowEl.getBoundingClientRect();
            const windowWidth = rect.width;
            const windowHeight = rect.height;

            // Get base position from CSS (the absolute positioning)
            const computedStyle = window.getComputedStyle(windowEl);
            const baseLeft = parseInt(computedStyle.left) || 0;
            const baseTop = parseInt(computedStyle.top) || 0;

            // Viewport bounds - allow overlapping dock but not navbar
            const navbarHeight = 40;
            // Allow window to extend below viewport (overlap dock)
            const maxX = window.innerWidth - windowWidth - baseLeft;
            const minX = -baseLeft;
            const maxY = window.innerHeight - 50 - baseTop; // Allow most of window to go below
            const minY = navbarHeight - baseTop; // Cannot overlap navbar

            // Constrain position within viewport
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));
        }

        setPosition({
            x: newX,
            y: newY,
        });
    }, [isDragging]);

    // Handle mouse up - stop dragging
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Add/remove global mouse event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Handle window click - bring to front
    const handleWindowClick = useCallback(() => {
        bringToFront(windowId);
    }, [bringToFront, windowId]);

    // Handle close button - animate window collapsing to dock
    const handleClose = useCallback((e) => {
        e.stopPropagation();
        const windowEl = windowRef.current;
        if (!windowEl) {
            closeWindow(windowId);
            return;
        }

        // Get dock position (center bottom of screen)
        const dockY = window.innerHeight - 40;
        const dockX = window.innerWidth / 2;
        const rect = windowEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Animate window shrinking toward dock with collapse effect
        gsap.to(windowEl, {
            scale: 0.1,
            opacity: 0,
            x: `+=${dockX - centerX}`,
            y: `+=${dockY - centerY}`,
            duration: 0.35,
            ease: 'power3.in',
            onComplete: () => {
                closeWindow(windowId);
            },
        });
    }, [closeWindow, windowId]);

    // Handle minimize button - genie effect shrinking to dock
    const handleMinimize = useCallback((e) => {
        e.stopPropagation();
        const windowEl = windowRef.current;
        if (!windowEl) {
            minimizeWindow(windowId);
            return;
        }

        // Get dock position
        const dockY = window.innerHeight - 40;
        const dockX = window.innerWidth / 2;
        const rect = windowEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Animate with macOS genie-like effect
        gsap.to(windowEl, {
            scale: 0.15,
            opacity: 0.5,
            x: `+=${dockX - centerX}`,
            y: `+=${dockY - centerY}`,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                // Reset transform for when window is restored
                gsap.set(windowEl, { clearProps: 'all' });
                minimizeWindow(windowId);
            },
        });
    }, [minimizeWindow, windowId]);

    // Handle maximize button
    const handleMaximize = useCallback((e) => {
        e.stopPropagation();

        // Save current position before maximizing
        if (!windowState?.isMaximized) {
            setPreMaximizePosition({ ...position });
        } else {
            // Restore previous position when un-maximizing
            setPosition(preMaximizePosition);
        }

        toggleMaximize(windowId);
    }, [toggleMaximize, windowId, windowState?.isMaximized, position, preMaximizePosition]);

    // Don't render if window is not open or is minimized - AFTER all hooks are called
    if (!windowState?.isOpen) return null;
    if (windowState?.isMinimized) return null;

    // Determine window styles based on maximized state
    const isMaximized = windowState?.isMaximized;

    // Windows that should have limited width even when maximized
    const limitedWidthWindows = ['projectDetail'];
    const hasLimitedWidth = limitedWidthWindows.includes(windowId);

    // macOS-style maximized window: rounded corners, doesn't cover nav/dock
    const windowStyles = isMaximized ? {
        position: 'fixed',
        top: '52px', // Below navbar with padding (more space like dock)
        left: '8px',
        right: hasLimitedWidth ? 'auto' : '8px',
        bottom: '88px', // Above dock with padding
        width: hasLimitedWidth ? 'auto' : 'calc(100% - 16px)',
        maxWidth: hasLimitedWidth ? undefined : 'none',
        height: 'calc(100vh - 140px)', // 52px top + 88px bottom
        zIndex: windowState.zIndex,
        transform: 'none',
        borderRadius: '12px',
        overflow: 'hidden',
    } : {
        zIndex: windowState.zIndex,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
    };

    return (
        <div
            ref={windowRef}
            id={windowId}
            className={`window-animate-open ${isMaximized ? 'window-maximized' : ''} ${className}`}
            style={windowStyles}
            onClick={handleWindowClick}
        >
            {/* Window Header with Controls */}
            <div
                id="window-header"
                onMouseDown={handleMouseDown}
                style={{ cursor: isMaximized ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
            >
                {showControls && (
                    <div id="window-controls">
                        <button
                            className="close"
                            onClick={handleClose}
                            aria-label="Close window"
                            title="Close"
                        />
                        <button
                            className="minimize"
                            onClick={handleMinimize}
                            aria-label="Minimize window"
                            title="Minimize"
                        />
                        <button
                            className="maximize"
                            onClick={handleMaximize}
                            aria-label={isMaximized ? "Restore window" : "Maximize window"}
                            title={isMaximized ? "Restore" : "Maximize"}
                        />
                    </div>
                )}

                <h2>{title}</h2>

                {/* Spacer to center the title */}
                {showControls && <div className="w-16" />}
            </div>

            {/* Window Content */}
            <div className={isMaximized ? 'window-content-maximized' : ''}>
                {children}
            </div>
        </div>
    );
};

export default WindowContainer;
