import { create } from 'zustand';

/**
 * Theme State Management Store
 * Handles dark/light theme with localStorage persistence and system preference detection
 */

const THEME_STORAGE_KEY = 'portfolio-theme';

/**
 * Get initial theme from localStorage or system preference
 */
const getInitialTheme = () => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        // Fall back to system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
};

/**
 * Apply theme to document
 */
const applyTheme = (theme) => {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
};

const useThemeStore = create((set, get) => ({
    // Current theme: 'light' or 'dark'
    theme: 'light',

    // Whether theme has been initialized
    isInitialized: false,

    /**
     * Initialize theme on app mount
     * Reads from localStorage/system preference and applies
     */
    initializeTheme: () => {
        const theme = getInitialTheme();
        applyTheme(theme);
        set({ theme, isInitialized: true });
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';

        // Persist to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);

        // Apply to document
        applyTheme(newTheme);

        set({ theme: newTheme });
    },

    /**
     * Set specific theme
     */
    setTheme: (newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') return;

        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        applyTheme(newTheme);
        set({ theme: newTheme });
    },

    /**
     * Check if dark mode is active
     */
    isDark: () => get().theme === 'dark',
}));

export default useThemeStore;
