import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;