import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { navIcons } from "#constants";
import { useWindowStore, useThemeStore } from "#store";

const NavBar = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { openWindow } = useWindowStore();
    const { theme, toggleTheme, initializeTheme } = useThemeStore();

    // Initialize theme on mount
    useEffect(() => {
        initializeTheme();
    }, [initializeTheme]);

    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Window dropdown menu items
    const windowMenuItems = [
        { id: 'finder', name: 'Projects', type: 'window' },
        { id: 'contact', name: 'Contact', type: 'window' },
        { id: 'resume', name: 'Resume', type: 'window' },
        { id: 'separator', type: 'separator' },
        { id: 'terminal', name: 'Skills', type: 'window' },
    ];

    // Handle menu item click
    const handleMenuItemClick = (item) => {
        if (item.type === 'window') {
            openWindow(item.id);
        }
        setIsDropdownOpen(false);
    };

    // Handle icon click (for theme toggle)
    const handleIconClick = (iconId) => {
        // Icon 4 is the mode/theme toggle
        if (iconId === 4) {
            toggleTheme();
        }
    };

    return (
        <nav>
            <div className="flex items-center gap-x-3">
                <img src="/images/logo.svg" alt="Logo" className="w-5 h-5" />
                <p className="font-bold">Suharshit's Portfolio</p>

                {/* Window Dropdown */}
                <div
                    className={`nav-dropdown ${isDropdownOpen ? 'open' : ''}`}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <button className="nav-dropdown-trigger">
                        Window
                    </button>

                    {isDropdownOpen && (
                        <div className="nav-dropdown-menu">
                            <div className="nav-dropdown-menu-inner">
                                {windowMenuItems.map((item) => (
                                    item.type === 'separator' ? (
                                        <div key={item.id} className="nav-dropdown-separator" />
                                    ) : (
                                        <button
                                            key={item.id}
                                            className="nav-dropdown-item"
                                            onClick={() => handleMenuItemClick(item)}
                                        >
                                            {item.name}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <ul className="flex items-center gap-x-3">
                    {navIcons.map(({ id, img }) => (
                        <li
                            key={id}
                            onClick={() => handleIconClick(id)}
                            className={id === 4 ? 'theme-toggle' : ''}
                        >
                            <img
                                src={img}
                                className={`w-5 h-5 icon-hover ${id === 4 ? 'theme-icon' : ''} ${id === 4 && theme === 'dark' ? 'rotate-180' : ''}`}
                                alt={`icon-${id}`}
                            />
                        </li>
                    ))}
                </ul>
                <time dateTime={currentTime.format()}>
                    {currentTime.format("ddd MMM D h:mm A")}
                </time>
            </div>
        </nav>
    )
}

export default NavBar