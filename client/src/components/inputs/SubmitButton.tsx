import React from 'react';

interface SubmitButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, loading, children }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading}
      className="sm:w-auto bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg text-black rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-100"
    >
      {children}
    </button>
  );
};

export default SubmitButton;
