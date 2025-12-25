import React, { useState } from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';
import { projectSnapshots, galleryCategories, getProjectsByCategory } from '#constants/projects.constants';

/**
 * Photos - Project Snapshots Gallery
 * Features: Category filtering, grid layout, Apple-like hover animations
 */
const Photos = () => {
    const { openWindow, bringToFront } = useWindowStore();
    const [activeCategory, setActiveCategory] = useState('Library');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Get filtered projects based on active category
    const filteredProjects = getProjectsByCategory(activeCategory);

    // Handle category change with fade animation
    const handleCategoryChange = (category) => {
        if (category === activeCategory) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setActiveCategory(category);
            setIsTransitioning(false);
        }, 150);
    };

    // Handle project click to open detail view
    const handleProjectClick = (project) => {
        openWindow('projectDetail', project);
        // Bring to front after a small delay to ensure window is open
        setTimeout(() => bringToFront('projectDetail'), 10);
    };

    return (
        <WindowContainer
            windowId="photos"
            title="Gallery"
        >
            <div className="flex h-full">
                {/* Sidebar */}
                <aside className="gallery-sidebar">
                    <h2>Library</h2>
                    <ul>
                        {galleryCategories.map((category) => (
                            <li
                                key={category.id}
                                className={activeCategory === category.title ? 'active' : ''}
                                onClick={() => handleCategoryChange(category.title)}
                            >
                                <img src={category.icon} alt={category.title} />
                                <p>{category.title}</p>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Project Grid */}
                <div className="gallery-content flex-1">
                    {/* Category Header */}
                    <div className="gallery-header">
                        <h3>{activeCategory}</h3>
                        <span className="project-count">{filteredProjects.length} projects</span>
                    </div>

                    {/* Projects Grid */}
                    <div
                        className={`projects-grid ${isTransitioning ? 'fade-out' : 'fade-in'}`}
                    >
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="project-card"
                                onClick={() => handleProjectClick(project)}
                            >
                                {/* Thumbnail */}
                                <div className="project-thumbnail">
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        draggable={false}
                                    />
                                    {/* Image count badge */}
                                    {project.images.length > 1 && (
                                        <span className="image-count">
                                            {project.images.length}
                                        </span>
                                    )}
                                </div>

                                {/* Project Info */}
                                <div className="project-info">
                                    <h4>{project.title}</h4>
                                    <div className="tech-badges">
                                        {project.techStack.slice(0, 2).map((tech, index) => (
                                            <span key={index} className="tech-badge">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filteredProjects.length === 0 && (
                        <div className="empty-state">
                            No projects in this category
                        </div>
                    )}
                </div>
            </div>
        </WindowContainer>
    );
};

export default Photos;
