import React, { useState, useRef, useEffect } from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';
import { socialLinks, personalInfo, detectIntent, aiResponses } from '#constants';
import { ExternalLink, ArrowLeft, RotateCw, Globe, AlertTriangle, Send, Bot, User } from 'lucide-react';

// Sites known to block iframe embedding (X-Frame-Options / CSP)
const BLOCKED_SITES = [
    'github.com',
    'linkedin.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    'instagram.com',
    'medium.com',
    'dev.to',
    'stackoverflow.com',
    'reddit.com',
    'codolio.com',
];

/**
 * Check if a URL is from a site that blocks iframe embedding
 */
const isBlockedSite = (url) => {
    try {
        const hostname = new URL(url).hostname.toLowerCase();
        return BLOCKED_SITES.some(site => hostname.includes(site));
    } catch {
        return false;
    }
};

/**
 * AI response generator using intent detection
 */
const generateAIResponse = (question) => {
    const { intent, data } = detectIntent(question);
    return aiResponses.generateResponse(intent, data);
};

/**
 * Safari - Multi-mode browser window
 * Mode 1: Home screen with bookmarks + AI (default)
 * Mode 2: Embedded iframe browser for external links
 */
const Safari = () => {
    const { windows, updateWindowData, bringToFront } = useWindowStore();
    const safariData = windows.safari?.data;
    const iframeRef = useRef(null);
    const chatInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [iframeFailed, setIframeFailed] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, type: 'bot', text: `Hi! I'm ${personalInfo.name}'s portfolio assistant. Ask me about skills, projects, or how to get in touch!` }
    ]);
    const [inputValue, setInputValue] = useState('');

    // Check if we're in browser mode (URL provided)
    const isBrowserMode = safariData?.isEmbedded && safariData?.url;
    const currentUrl = safariData?.url || '';
    const pageTitle = safariData?.title || 'Safari';
    const originalUrl = safariData?.originalUrl || currentUrl;

    // Check if this URL is from a blocked site
    const isBlocked = isBlockedSite(originalUrl);

    // Reset states when URL changes
    useEffect(() => {
        if (isBrowserMode) {
            if (isBlocked) {
                setIsLoading(false);
                setIframeFailed(true);
            } else {
                setIsLoading(true);
                setIframeFailed(false);
            }
        }
    }, [currentUrl, isBrowserMode, isBlocked]);

    // Scroll chat to bottom when new messages added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Handle iframe load success
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    // Handle iframe load error
    const handleIframeError = () => {
        setIsLoading(false);
        setIframeFailed(true);
    };

    // Go back to home
    const handleBack = () => {
        updateWindowData('safari', null);
        bringToFront('safari');
    };

    // Refresh the iframe
    const handleRefresh = () => {
        if (iframeRef.current && !iframeFailed) {
            setIsLoading(true);
            iframeRef.current.src = currentUrl;
        }
    };

    // Open in actual new tab
    const handleOpenInNewTab = () => {
        window.open(originalUrl, '_blank', 'noopener,noreferrer');
    };

    // Handle bookmark click
    const handleBookmarkClick = (social) => {
        // Handle mailto links differently
        if (social.type === 'mail') {
            window.location.href = social.url;
            return;
        }

        // Update Safari data (preserves maximized state)
        updateWindowData('safari', {
            url: social.url,
            originalUrl: social.url,
            title: social.label,
            isEmbedded: true
        });
        bringToFront('safari');
    };

    // Handle AI chat submit
    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), type: 'user', text: inputValue };
        const botResponse = { id: Date.now() + 1, type: 'bot', text: generateAIResponse(inputValue) };

        setChatMessages(prev => [...prev, userMessage, botResponse]);
        setInputValue('');
    };

    return (
        <WindowContainer
            windowId="safari"
            title={isBrowserMode ? pageTitle : "Safari"}
        >
            {isBrowserMode ? (
                /* Browser Mode - Show iframe with URL */
                <div className="safari-browser">
                    {/* Browser Toolbar */}
                    <div className="safari-toolbar">
                        <div className="safari-nav-buttons">
                            <button
                                onClick={handleBack}
                                className="safari-nav-btn"
                                title="Back to Home"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleRefresh}
                                className={`safari-nav-btn ${isLoading ? 'animate-spin' : ''}`}
                                title="Refresh"
                                disabled={iframeFailed}
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="safari-address-bar">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="safari-url">{originalUrl}</span>
                        </div>

                        <button
                            onClick={handleOpenInNewTab}
                            className="safari-external-btn"
                            title="Open in new tab"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="safari-loading">
                            <div className="safari-loading-bar" />
                        </div>
                    )}

                    {/* Iframe Content or Fallback */}
                    {iframeFailed ? (
                        <div className="safari-fallback">
                            <AlertTriangle className="w-12 h-12 text-orange-400 mb-4" />
                            <h3>This site can't be displayed here</h3>
                            <p>
                                {pageTitle} doesn't allow embedding in other websites for security reasons.
                            </p>
                            <button
                                onClick={handleOpenInNewTab}
                                className="safari-fallback-btn"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open in new tab
                            </button>
                        </div>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={currentUrl}
                            className="safari-iframe"
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            title={pageTitle}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            ) : (
                /* Home Mode - Bookmarks + AI */
                <div className="safari-home">
                    {/* Pinned Bookmarks Bar */}
                    <div className="safari-bookmarks-bar">
                        <span className="safari-bookmarks-label">Bookmarks</span>
                        <div className="safari-bookmarks-tags">
                            {socialLinks.map((social) => (
                                <button
                                    key={social.id}
                                    className="safari-bookmark-tag"
                                    onClick={() => handleBookmarkClick(social)}
                                    title={social.label}
                                    style={{ '--tag-color': social.bgColor }}
                                >
                                    <img
                                        src={social.icon}
                                        alt={social.label}
                                        className="w-4 h-4 filter brightness-0 invert"
                                    />
                                    <span>{social.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable AI Chat Section */}
                    <div className="safari-chat-area">
                        <div className="safari-chat-header">
                            <Bot className="w-4 h-4" />
                            <span>Portfolio Assistant</span>
                        </div>

                        <div className="safari-chat-container" ref={chatContainerRef}>
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`safari-chat-bubble ${msg.type}`}
                                >
                                    <div className="safari-chat-avatar">
                                        {msg.type === 'bot' ? (
                                            <Bot className="w-4 h-4" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="safari-chat-text">
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} dangerouslySetInnerHTML={{
                                                __html: line
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/• /g, '&bull; ')
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pinned Input Bar at Bottom */}
                    <form className="safari-chat-input-bar" onSubmit={handleChatSubmit}>
                        <input
                            ref={chatInputRef}
                            type="text"
                            placeholder="Ask about skills, projects, contact..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" disabled={!inputValue.trim()}>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </WindowContainer>
    );
};

export default Safari;
