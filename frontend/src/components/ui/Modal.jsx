import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import './Modal.css';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cm-modal-overlay" onClick={onClose}>
      <div className="cm-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cm-modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '0.25rem' }}>
            <X size={20} />
          </Button>
        </div>
        <div className="cm-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
