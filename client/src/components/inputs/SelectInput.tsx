import React from 'react';

interface SelectInputProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  setValue: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, options, value, setValue }) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <label htmlFor={name} className='text-white text-sm sm:text-base'>{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={name}
        name={name}
        className="bg-neutral-800 p-2 sm:p-3 text-neutral-200 rounded-md w-full text-sm sm:text-base"
      >
        <option value="" className='bg-neutral-900 text-gray-400'>-- select --</option>
        {options.map((option, index) => 
          <option key={index} value={option} className='bg-neutral-900'>{option}</option>
        )}
      </select>
    </div>
  );
}

export default SelectInput;
