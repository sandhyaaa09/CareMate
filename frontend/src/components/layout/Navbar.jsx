import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/pages.css';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <HeartPulse size={28} />
        CareMate
      </Link>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="ghost" onClick={toggleTheme} style={{ marginRight: '1rem', padding: '0.5rem', color: 'var(--text-primary)' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <Link to="/login" style={{color: 'var(--text-primary)', fontWeight: 500, marginRight: '1rem'}}>
          Login
        </Link>
        <Link to="/login?tab=signup">
          <Button variant="primary">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};
