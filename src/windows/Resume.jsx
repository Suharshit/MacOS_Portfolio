import React from 'react';
import { WindowContainer } from '#hoc';
import { Download } from 'lucide-react';

/**
 * Resume - PDF Resume viewer/downloader
 * Features: Embedded PDF viewer with download option
 */
const Resume = () => {
    const resumePath = '/files/resume.pdf';

    const handleDownload = () => {
        // Create a temporary anchor to trigger download
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Suharshit_Singh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <WindowContainer
            windowId="resume"
            title="Resume.pdf"
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
                <span className="text-sm text-gray-600">Resume.pdf</span>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>
            </div>

            {/* PDF Embed */}
            <div className="w-[600px] h-[70vh] bg-gray-200">
                <iframe
                    src={resumePath}
                    title="Resume"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                />
            </div>
        </WindowContainer>
    );
};

export default Resume;
