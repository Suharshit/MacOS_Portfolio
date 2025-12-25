import { useWindowStore } from '#store';

/**
 * useExternalNavigation - Central hook for handling external links
 * Opens URLs in the Safari window instead of new browser tabs
 */
export const useExternalNavigation = () => {
    const { openWindow, bringToFront } = useWindowStore();

    /**
     * Open a URL in the Safari window
     * @param {string} url - The URL to open
     * @param {string} title - Optional title for the page
     */
    const openInSafari = (url, title = '') => {
        // Convert YouTube watch URLs to embed URLs for iframe compatibility
        const embedUrl = convertToEmbedUrl(url);

        openWindow('safari', {
            url: embedUrl,
            originalUrl: url,
            title: title || getDomainFromUrl(url),
            isEmbedded: true
        });

        // Bring Safari to front
        setTimeout(() => bringToFront('safari'), 10);
    };

    /**
     * Check if a URL can be opened in external tab only
     * (Sites that block iframe embedding)
     */
    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return { openInSafari, openInNewTab };
};

/**
 * Convert video URLs to embed format for iframe compatibility
 */
const convertToEmbedUrl = (url) => {
    // YouTube watch URLs
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // Vimeo URLs
    if (url.includes('vimeo.com')) {
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
    }

    return url;
};

/**
 * Extract YouTube video ID from various URL formats
 */
const extractYouTubeId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
        /youtube\.com\/v\/([^&\?\/]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
};

/**
 * Extract domain name from URL for display
 */
const getDomainFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
};

export default useExternalNavigation;
