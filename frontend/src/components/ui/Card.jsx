import React from 'react';
import '../../styles/components.css';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`cm-card ${className}`} {...props}>
      <div className="cm-card-glow"></div>
      <div className="cm-card-content">
        {children}
      </div>
    </div>
  );
};
