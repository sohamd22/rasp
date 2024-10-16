import React, { ReactNode } from 'react';

interface HeadingProps {
    children: ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ children }) => {
    return <h2 className="xl:text-6xl md:text-5xl text-4xl font-extrabold text-white">{children}</h2>;
}

export default Heading;