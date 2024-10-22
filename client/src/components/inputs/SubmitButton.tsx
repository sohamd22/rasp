import React from 'react';

interface SubmitButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-white px-4 py-2 text-lg text-black rounded-md font-semibold"
    >
      submit
    </button>
  );
};

export default SubmitButton;