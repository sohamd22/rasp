import React, { ReactNode } from 'react';

interface ParagraphProps {
    children: ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
    return (
        <p className="xl:text-2xl md:text-xl text-lg font-medium leading-normal">{children}</p>
    );
}

export default Paragraph;