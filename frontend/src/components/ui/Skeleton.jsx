import React from 'react';
import '../../styles/skeleton.css';

export const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div 
      className={`cm-skeleton ${className}`} 
      style={style}
    ></div>
  );
};
