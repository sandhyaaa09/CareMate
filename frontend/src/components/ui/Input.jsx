import React, { useState } from 'react';
import '../../styles/components.css';

export const Input = ({ label, id, type = 'text', className = '', value, defaultValue, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isActive = isFocused || hasValue || value || defaultValue;

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  return (
    <div className={`cm-input-wrapper ${className}`}>
      <input
        id={id}
        type={type}
        className={`cm-input ${isActive ? 'cm-input-active' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
      <label htmlFor={id} className="cm-label">
        {label}
      </label>
    </div>
  );
};
