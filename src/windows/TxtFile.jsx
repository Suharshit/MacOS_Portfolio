import React from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';

/**
 * TxtFile - Text file viewer for project descriptions
 * Features: Displays description array as formatted text
 */
const TxtFile = () => {
    const { windows } = useWindowStore();
    const fileData = windows.txtfile?.data;

    if (!fileData) return null;

    return (
        <WindowContainer
            windowId="txtfile"
            title={fileData.name || 'Untitled.txt'}
        >
            <div className="p-6 max-h-96 overflow-y-auto">
                {/* Optional subtitle */}
                {fileData.subtitle && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {fileData.subtitle}
                    </h3>
                )}

                {/* Optional image */}
                {fileData.image && (
                    <img
                        src={fileData.image}
                        alt={fileData.name}
                        className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                )}

                {/* Description paragraphs */}
                {fileData.description && (
                    <div className="space-y-3 text-sm text-gray-600 font-roboto leading-relaxed">
                        {fileData.description.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>
        </WindowContainer>
    );
};

export default TxtFile;
