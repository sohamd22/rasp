import React, { ChangeEvent } from 'react';

interface TextBoxProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  maxLength?: number;
}

const TextBox: React.FC<TextBoxProps> = ({ label, name, placeholder, value, setValue, maxLength }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength === undefined || newValue.length <= maxLength) {
      setValue(newValue);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-white'>{label}</label>
      <textarea
        autoComplete="off"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className="bg-neutral-800 p-3 text-neutral-200 h-32 resize-none rounded-md"
      />
    </div>
  );
};

export default TextBox;