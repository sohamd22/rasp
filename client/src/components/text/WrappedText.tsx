import React from 'react';

interface WrappedTextProps {
	children: React.ReactNode;
	className?: string;
	size: 'large' | 'small';
}

const WrappedText: React.FC<WrappedTextProps> = ({ children, className = '', size }) => {
	return size === 'large' ? (
		<span className={`xl:text-xl md:text-lg text-base w-max font-normal p-3 border border-dashed opacity-75 ${className}`}>
			{children}
		</span>
	) : (
		<span className="w-max font-semibold p-2 bg-gradient-to-r from-orange-500 to-orange-300 text-black">
			{children}
		</span>
	);
};

export default WrappedText;
