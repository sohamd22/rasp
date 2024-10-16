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
      className="bg-white px-4 py-2 text-lg text-black rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      { children }
    </button>
  );
};

export default SubmitButton;