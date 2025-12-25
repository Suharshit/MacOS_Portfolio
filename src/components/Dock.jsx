import React, { useState, useRef } from 'react';
import { dockApps } from '#constants';
import { useWindowStore } from '#store';

/**
 * Dock - macOS-style application dock
 * Features: hover magnification effect, tooltips, bounce animation on click
 */
const Dock = () => {
    const { openWindow, windows, bringToFront, restoreWindow, closeAllWindows } = useWindowStore();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const dockRef = useRef(null);

    // Handle dock icon click
    const handleAppClick = (app) => {
        // Handle trash/archive icon - close all windows
        if (app.id === 'trash') {
            closeAllWindows();
            return;
        }

        if (!app.canOpen) return;

        // Map dock app IDs to window IDs
        const windowId = app.id;
        const windowState = windows[windowId];

        if (windowState?.isOpen) {
            // If minimized, restore it
            if (windowState.isMinimized) {
                restoreWindow(windowId);
            } else {
                // Otherwise just bring to front
                bringToFront(windowId);
            }
        } else {
            // Open new window
            openWindow(windowId);
        }
    };

    // Calculate scale based on distance from hovered icon
    const getScale = (index) => {
        if (hoveredIndex === null) return 1;

        const distance = Math.abs(index - hoveredIndex);

        if (distance === 0) return 1.4;
        if (distance === 1) return 1.2;
        if (distance === 2) return 1.1;
        return 1;
    };

    // Get transform origin based on position
    const getTransformOrigin = (index) => {
        if (hoveredIndex === null) return 'bottom';
        if (index < hoveredIndex) return 'bottom right';
        if (index > hoveredIndex) return 'bottom left';
        return 'bottom';
    };

    // Check if any window is maximized
    const hasMaximizedWindow = Object.values(windows).some(w => w.isOpen && w.isMaximized);

    return (
        <section
            id="dock"
            style={{
                // Move dock down when a window is maximized to add space
                bottom: hasMaximizedWindow ? '8px' : '20px',
                // Dock stays in front only when a window is maximized
                zIndex: hasMaximizedWindow ? 9999 : 50,
                transition: 'bottom 0.3s ease-out',
            }}
        >
            <div className="dock-container" ref={dockRef}>
                {dockApps.map((app, index) => (
                    <div
                        key={app.id}
                        className="dock-icon group"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => handleAppClick(app)}
                        style={{
                            transform: `scale(${getScale(index)})`,
                            transformOrigin: getTransformOrigin(index),
                            transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                            cursor: app.canOpen ? 'pointer' : 'default',
                            opacity: app.canOpen ? 1 : 0.7,
                        }}
                    >
                        {/* Tooltip */}
                        <div
                            className="tooltip absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                        >
                            {app.name}
                        </div>

                        {/* App Icon */}
                        <img
                            src={`/images/${app.icon}`}
                            alt={app.name}
                            draggable={false}
                        />

                        {/* Active indicator dot */}
                        {windows[app.id]?.isOpen && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Dock;
