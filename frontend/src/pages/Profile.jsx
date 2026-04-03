import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>My Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and settings.</p>
        </header>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <Card style={{ flex: 1, padding: '2rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                 <User size={40} />
               </div>
               <div>
                  <h2 style={{ margin: 0 }}>{user?.fullName || 'User Name'}</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{user?.email || 'user@example.com'}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', fontWeight: 500, color: '#6366f1', textTransform: 'capitalize' }}>
                     {user?.role?.replace('ROLE_', '') || 'Patient'}
                  </p>
               </div>
             </div>

             <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Input label="Full Name" defaultValue={user?.fullName || ''} />
                <Input label="Email Address" type="email" defaultValue={user?.email || ''} />
                <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                   <Button variant="outline" type="button">Cancel</Button>
                   <Button variant="primary" type="button">Save Changes</Button>
                </div>
             </form>
          </Card>
          
          <div style={{ flex: 1 }}></div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
