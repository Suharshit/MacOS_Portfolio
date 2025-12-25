import React, { useState, useEffect } from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';
import { useExternalNavigation } from '#hooks';

/**
 * ProjectDetail - macOS-style project detail window with image carousel
 * Features: Image slideshow, navigation arrows, dot indicators, tech badges, links
 */
const ProjectDetail = () => {
    const { windows } = useWindowStore();
    const { openInSafari } = useExternalNavigation();
    const project = windows.projectDetail?.data;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Reset image index when project changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project?.id]);

    if (!project) {
        return (
            <WindowContainer windowId="projectDetail" title="Project Details">
                <div className="flex items-center justify-center h-64 text-gray-400">
                    Select a project to view details
                </div>
            </WindowContainer>
        );
    }

    const images = project.images || [project.thumbnail];
    const hasMultipleImages = images.length > 1;

    // Navigate to previous image
    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Navigate to next image
    const handleNextImage = (e) => {
        e.stopPropagation();
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Go to specific image
    const handleDotClick = (index) => {
        if (isAnimating || index === currentImageIndex) return;
        setIsAnimating(true);
        setCurrentImageIndex(index);
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Open demo in Safari
    const handleDemoClick = (e) => {
        e.preventDefault();
        openInSafari(project.demoUrl, `${project.title} - Demo`);
    };

    // Open GitHub in Safari
    const handleGithubClick = (e) => {
        e.preventDefault();
        openInSafari(project.githubUrl, `${project.title} - GitHub`);
    };

    return (
        <WindowContainer
            windowId="projectDetail"
            title={project.title}
        >
            <div className="project-detail">
                {/* Image Carousel */}
                <div className="carousel">
                    <div className="carousel-image-container">
                        <img
                            src={images[currentImageIndex]}
                            alt={`${project.title} - ${currentImageIndex + 1}`}
                            className={`carousel-image ${isAnimating ? 'animating' : ''}`}
                            draggable={false}
                        />

                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    className="carousel-arrow carousel-arrow-left"
                                    onClick={handlePrevImage}
                                    aria-label="Previous image"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>
                                <button
                                    className="carousel-arrow carousel-arrow-right"
                                    onClick={handleNextImage}
                                    aria-label="Next image"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dot Indicators */}
                    {hasMultipleImages && (
                        <div className="carousel-dots">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => handleDotClick(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Project Info */}
                <div className="project-detail-info">
                    <h2 className="project-detail-title">{project.title}</h2>

                    <p className="project-detail-description">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="project-detail-tech">
                        {project.techStack.map((tech, index) => (
                            <span key={index} className="tech-badge-lg">
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="project-detail-actions">
                        {project.demoUrl && (
                            <button
                                onClick={handleDemoClick}
                                className="action-btn action-btn-primary"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                    <path d="M15 3h6v6" />
                                    <path d="M10 14L21 3" />
                                </svg>
                                View Demo
                            </button>
                        )}
                        {project.githubUrl && (
                            <button
                                onClick={handleGithubClick}
                                className="action-btn action-btn-secondary"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </WindowContainer>
    );
};

export default ProjectDetail;
