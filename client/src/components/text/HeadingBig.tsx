import React, { ReactNode } from 'react';

interface HeadingBigProps {
    children: ReactNode;
}

const HeadingBig: React.FC<HeadingBigProps> = ({ children }) => {
    return <h1 className="2xl:text-7xl lg:text-6xl text-5xl font-extrabold tracking-tighter text-white">{children}</h1>;
}

export default HeadingBig;