import React, { useState } from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';
import { locations } from '#constants';
import { useExternalNavigation } from '#hooks';

// View mode icons (SVG paths)
const ViewIcons = {
    grid: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
    ),
    list: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="2" width="14" height="2" rx="0.5" />
            <rect x="1" y="7" width="14" height="2" rx="0.5" />
            <rect x="1" y="12" width="14" height="2" rx="0.5" />
        </svg>
    ),
    columns: (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="1" width="4" height="14" rx="1" />
            <rect x="6" y="1" width="4" height="14" rx="1" />
            <rect x="11" y="1" width="4" height="14" rx="1" />
        </svg>
    ),
};

/**
 * Finder - macOS Finder-style file browser for projects
 * Features: sidebar navigation, view modes, folder/file icons, double-click to open
 */
const Finder = () => {
    const { openWindow } = useWindowStore();
    const { openInSafari } = useExternalNavigation();
    const [activeLocation, setActiveLocation] = useState('work');
    const [currentFolder, setCurrentFolder] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid, list, columns

    // Get current location data
    const locationData = locations[activeLocation];

    // Get items to display (either root children or folder children)
    const displayItems = currentFolder
        ? currentFolder.children
        : locationData?.children || [];

    // Get projects from Work folder for sidebar
    const workProjects = locations.work?.children?.filter(item => item.kind === 'folder') || [];

    // Handle item double-click
    const handleItemDoubleClick = (item) => {
        if (item.kind === 'folder') {
            // Navigate into folder
            setCurrentFolder(item);
        } else if (item.kind === 'file') {
            // Open appropriate viewer based on file type
            switch (item.fileType) {
                case 'txt':
                    openWindow('txtfile', item);
                    break;
                case 'img':
                    openWindow('imgfile', item);
                    break;
                case 'url':
                    // Open in Safari browser
                    if (item.href) {
                        openInSafari(item.href, item.name);
                    }
                    break;
                case 'pdf':
                    openWindow('resume', item);
                    break;
                case 'fig':
                    // Open Figma link in Safari
                    if (item.href) {
                        openInSafari(item.href, 'Figma Design');
                    }
                    break;
                default:
                    break;
            }
        }
    };

    // Handle sidebar location click
    const handleLocationClick = (locationType) => {
        setActiveLocation(locationType);
        setCurrentFolder(null); // Reset to root of new location
    };

    // Handle project click in sidebar
    const handleProjectClick = (project) => {
        setActiveLocation('work');
        setCurrentFolder(project);
    };

    // Handle back navigation
    const handleBack = () => {
        setCurrentFolder(null);
    };

    // Get file type badge color
    const getFileTypeColor = (fileType) => {
        switch (fileType) {
            case 'txt': return 'bg-blue-100 text-blue-600';
            case 'img': return 'bg-green-100 text-green-600';
            case 'url': return 'bg-orange-100 text-orange-600';
            case 'pdf': return 'bg-red-100 text-red-600';
            case 'fig': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <WindowContainer
            windowId="finder"
            title={currentFolder?.name || locationData?.name || 'Finder'}
        >
            <div className="flex flex-col h-full">
                {/* Toolbar with navigation and view options */}
                <div className="finder-toolbar flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    {/* Left: Back button and path */}
                    <div className="flex items-center gap-3">
                        {currentFolder && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        {/* Current path with icon */}
                        <div className="flex items-center gap-2">
                            <img
                                src={currentFolder?.icon || locationData?.icon}
                                alt=""
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {currentFolder?.name || locationData?.name}
                            </span>
                        </div>
                    </div>

                    {/* Right: View mode buttons */}
                    <div className="flex items-center gap-1 bg-gray-200 rounded-md p-0.5">
                        {Object.entries(ViewIcons).map(([mode, icon]) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`p-1.5 rounded transition-colors ${viewMode === mode
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-1">
                    {/* Sidebar */}
                    <aside className="sidebar">
                        <h3>Favorites</h3>
                        <ul>
                            {Object.entries(locations).map(([key, location]) => (
                                <li
                                    key={location.id}
                                    className={activeLocation === key && !currentFolder ? 'active' : 'not-active'}
                                    onClick={() => handleLocationClick(key)}
                                >
                                    <img src={location.icon} alt={location.name} className="w-4" />
                                    <span className="text-sm">{location.name}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Projects Section */}
                        {workProjects.length > 0 && (
                            <>
                                <h3 className="mt-4">Projects</h3>
                                <ul>
                                    {workProjects.map((project) => (
                                        <li
                                            key={project.id}
                                            className={currentFolder?.id === project.id ? 'active' : 'not-active'}
                                            onClick={() => handleProjectClick(project)}
                                        >
                                            <img src="/images/folder.png" alt="" className="w-4" />
                                            <span className="text-sm truncate" title={project.name}>
                                                {project.name.length > 18
                                                    ? project.name.substring(0, 18) + '...'
                                                    : project.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </aside>

                    {/* Content Area */}
                    <div className="finder-content flex-1 p-4 bg-white overflow-auto">
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-4 gap-4">
                                {displayItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="finder-item flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                                        onDoubleClick={() => handleItemDoubleClick(item)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain group-hover:scale-105 transition-transform"
                                                draggable={false}
                                            />
                                        </div>
                                        <p className="text-xs text-center mt-2 text-gray-700 line-clamp-2 max-w-[100px]">
                                            {item.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-1">
                                {displayItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="finder-item flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onDoubleClick={() => handleItemDoubleClick(item)}
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-8 h-8 object-contain"
                                            draggable={false}
                                        />
                                        <span className="text-sm text-gray-700 flex-1">{item.name}</span>
                                        {item.kind === 'file' && item.fileType && (
                                            <span className={`text-xs px-2 py-0.5 rounded ${getFileTypeColor(item.fileType)}`}>
                                                {item.fileType.toUpperCase()}
                                            </span>
                                        )}
                                        {item.kind === 'folder' && (
                                            <span className="text-xs text-gray-400">
                                                {item.children?.length || 0} items
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Columns View */}
                        {viewMode === 'columns' && (
                            <div className="grid grid-cols-3 gap-2">
                                {displayItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="finder-item flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-100"
                                        onDoubleClick={() => handleItemDoubleClick(item)}
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-6 h-6 object-contain"
                                            draggable={false}
                                        />
                                        <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                                        {item.kind === 'folder' && (
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {displayItems.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                This folder is empty
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WindowContainer>
    );
};

export default Finder;
