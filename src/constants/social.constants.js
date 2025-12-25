/**
 * Social Links - Single Source of Truth
 * 
 * All social/contact data lives here.
 * Used by: Safari bookmarks, Contact window
 * To update links: Edit ONLY this file.
 */

export const socialLinks = [
    {
        id: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/suharshit-singh0905/',
        icon: '/icons/linkedin.svg',
        type: 'social',
        color: '#0A66C2',
        bgColor: '#0A66C2',
        embeddable: false,
    },
    {
        id: 'github',
        label: 'GitHub',
        url: 'https://github.com/Suharshit',
        icon: '/icons/github.svg',
        type: 'social',
        color: '#24292F',
        bgColor: '#24292F',
        embeddable: false,
    },
    {
        id: 'codolio',
        label: 'Codolio',
        url: 'https://codolio.com/profile/Suharshit',
        icon: '/icons/codolio.svg',
        type: 'social',
        color: '#6366F1',
        bgColor: '#6366F1',
        embeddable: false, // Most profile sites block iframes
    },
    {
        id: 'email',
        label: 'Email',
        url: 'mailto:suharshit123@gmail.com',
        icon: '/icons/mail.svg',
        type: 'mail',
        color: '#EA4335',
        bgColor: '#EA4335',
        embeddable: false,
    },
];

// Helper to get social by id
export const getSocialById = (id) => socialLinks.find(s => s.id === id);

// Helper to get all socials of a type
export const getSocialsByType = (type) => socialLinks.filter(s => s.type === type);
