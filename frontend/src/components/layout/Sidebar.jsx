import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LayoutDashboard, Calendar, Pill, User as UserIcon, LogOut, HeartPulse, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

export const Sidebar = ({ role }) => {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const patientLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Patients', path: '/patients', icon: UserIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const links = role === 'ROLE_DOCTOR' ? doctorLinks : patientLinks;

  return (
    <aside className="cm-card" style={{ width: '260px', height: 'calc(100vh - 2rem)', margin: '1rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: '1rem', border: 'none', background: 'var(--bg-card)', boxShadow: 'var(--glass-shadow)', borderRadius: '1rem' }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HeartPulse size={30} color="#4f46e5" />
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', fontFamily: 'Outfit' }}>CareMate</span>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`cm-btn ${isActive ? 'cm-btn-primary' : 'cm-btn-ghost'}`}
              style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%', fontSize: '1rem', gap: '1rem', borderRadius: '0.75rem', color: isActive ? '#fff' : 'var(--text-primary)' }}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1.5rem 1rem' }}>
        <Button variant="ghost" className="w-full" style={{ justifyContent: 'flex-start', gap: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          Toggle Theme
        </Button>
        <Button variant="ghost" className="w-full" style={{ justifyContent: 'flex-start', gap: '1rem', color: '#ef4444' }} onClick={logout}>
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </aside>
  );
};
