import React, { ReactNode } from 'react';

interface HighlightProps {
    children: ReactNode;
}

const Highlight: React.FC<HighlightProps> = ({ children }) => {
    return (
        <mark className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
            {children}
        </mark>
    );
}

export default Highlight;