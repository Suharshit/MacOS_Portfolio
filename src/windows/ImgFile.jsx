import React from 'react';
import { WindowContainer } from '#hoc';
import { useWindowStore } from '#store';

/**
 * ImgFile - Image preview viewer
 * Features: Displays images in a preview container
 */
const ImgFile = () => {
    const { windows } = useWindowStore();
    const fileData = windows.imgfile?.data;

    if (!fileData) return null;

    return (
        <WindowContainer
            windowId="imgfile"
            title={fileData.name || 'Image Preview'}
        >
            <div className="preview">
                <img
                    src={fileData.imageUrl}
                    alt={fileData.name || 'Preview'}
                    draggable={false}
                />
            </div>
        </WindowContainer>
    );
};

export default ImgFile;
