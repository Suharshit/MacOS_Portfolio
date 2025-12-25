import React from 'react';
import { WindowContainer } from '#hoc';
import { techStack } from '#constants';
import { Check, ChevronRight, Terminal as TerminalIcon } from 'lucide-react';

/**
 * Terminal - Skills/Tech stack display in terminal style
 * Features: Terminal aesthetic with checkmarks for tech categories
 */
const Terminal = () => {
    return (
        <WindowContainer
            windowId="terminal"
            title="Skills — zsh"
        >
            <div className="techstack">
                {/* Terminal prompt */}
                <div className="label">
                    <span className="text-gray-400">suharshit@MacBook</span>
                    <span className="text-[#FF3B30] ms-1">➜</span>
                    <span className="text-[#FF3B30] ms-1">~/skills</span>
                    <span className="text-gray-400 ms-1">git:(</span>
                    <span className="text-red-400">main</span>
                    <span className="text-gray-400">)</span>
                </div>

                {/* Tech stack list */}
                <ul className="content">
                    {techStack.map((category, index) => (
                        <li key={index} className="flex items-center">
                            <Check className="check" strokeWidth={3} />
                            <h3>{category.category}</h3>
                            <ul>
                                {category.items.map((item, itemIndex) => (
                                    <span
                                        key={itemIndex}
                                        className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                {/* Footnote */}
                <div className="footnote">
                    <p>
                        <ChevronRight />
                        Always learning new technologies
                    </p>
                    <p>
                        <TerminalIcon className="w-4" />
                        Building production-ready applications
                    </p>
                </div>
            </div>
        </WindowContainer>
    );
};

export default Terminal;
