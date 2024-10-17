import React from 'react'
import { useState } from 'react';

interface ArrayInputProps {
    label: string;
    name: string;
    placeholder: string;
    items: string[];
    setItems: (items: string[]) => void;
    maxLength?: number;
    maxItems?: number;
}

const ArrayInput: React.FC<ArrayInputProps> = ({ label, name, placeholder, items, setItems, maxLength, maxItems }) => {
    const [value, setValue] = useState<string>("");

    const addItem = () => {
        if (!value.trim() || items.includes(value)) return setValue("");
        if (maxItems && items.length >= maxItems) return;

        setItems([...items, value]);
        setValue("");
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addItem();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (maxLength === undefined || newValue.length <= maxLength) {
            setValue(newValue);
        }
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor={name} className='text-white text-sm md:text-base'>{label}</label>
            <div className="bg-neutral-800 px-3 py-2 md:px-4 md:py-3 text-neutral-200 flex flex-wrap gap-2 rounded-md">
                {items ? items.map((value, index) => (
                    <span
                        className='text-neutral-300 px-2 py-1 text-xs md:text-sm rounded-md bg-neutral-700 cursor-pointer hover:bg-red-500 hover:line-through break-all'
                        key={index}
                        onClick={() => {
                            setItems(items.filter((_, i) => i !== index));
                        }}
                    >
                        {value}
                    </span>
                )) : <></>}

                {(!maxItems || items.length < maxItems) && (
                    <div className="flex-grow flex items-center">
                        <input
                            type="text"
                            autoComplete="off"
                            id={name}
                            name={name}
                            placeholder={!items.length ? placeholder : "..."}
                            value={value}
                            className='text-neutral-200 outline-none bg-neutral-800 w-full text-sm md:text-base'
                            onChange={handleChange}
                            onKeyDown={onKeyDown}
                            maxLength={maxLength}
                        />
                        <button onClick={addItem} className="text-xl ml-2 focus:outline-none">+</button>
                    </div>
                )}
            </div>
            {maxItems && (
                <p className="text-xs md:text-sm text-gray-400">{items.length}/{maxItems} items</p>
            )}
        </div>
    )
}

export default ArrayInput;
