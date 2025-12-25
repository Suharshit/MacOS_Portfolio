import React from 'react';
import { WindowContainer } from '#hoc';
import { socialLinks } from '#constants';
import { useExternalNavigation } from '#hooks';
import { ExternalLink, Mail } from 'lucide-react';

/**
 * Contact - Social links contact window
 * Uses socialLinks from social.constants.js (single source of truth)
 * Features: macOS-style cards with hover effects, opens links in Safari
 */
const Contact = () => {
    const { openInSafari } = useExternalNavigation();

    // Handle social link click
    const handleSocialClick = (e, social) => {
        e.preventDefault();

        // Handle mailto links - open email client
        if (social.type === 'mail') {
            window.location.href = social.url;
            return;
        }

        // Open in Safari browser mode
        openInSafari(social.url, social.label);
    };

    return (
        <WindowContainer
            windowId="contact"
            title="Contact"
        >
            <div className="contact-window">
                <div className="contact-header">
                    <h2>Let's Connect!</h2>
                    <p>Feel free to reach out through any of these platforms.</p>
                </div>

                <div className="contact-grid">
                    {socialLinks.map((social) => (
                        <a
                            key={social.id}
                            href={social.url}
                            onClick={(e) => handleSocialClick(e, social)}
                            className="contact-card"
                            style={{ '--card-color': social.bgColor }}
                        >
                            <div className="contact-card-icon">
                                <img
                                    src={social.icon}
                                    alt={social.label}
                                    className="w-8 h-8 filter brightness-0 invert"
                                />
                            </div>
                            <div className="contact-card-content">
                                <h3>{social.label}</h3>
                                <span className="contact-card-url">
                                    {social.type === 'mail'
                                        ? social.url.replace('mailto:', '')
                                        : social.url.replace('https://', '').split('/')[0]
                                    }
                                </span>
                            </div>
                            <div className="contact-card-arrow">
                                {social.type === 'mail' ? (
                                    <Mail className="w-5 h-5" />
                                ) : (
                                    <ExternalLink className="w-5 h-5" />
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </WindowContainer>
    );
};

export default Contact;
