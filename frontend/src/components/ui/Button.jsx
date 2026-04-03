import React from 'react';
import '../../styles/components.css';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  return (
    <button className={`cm-btn cm-btn-${variant} cm-btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
};
