import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

const Patients = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>My Patients</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View patient directory and health records.</p>
          </div>
          <div style={{ width: '300px', position: 'relative' }}>
             <Input placeholder="Search patients..." style={{ paddingLeft: '2.5rem' }} />
             <Search size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
          </div>
        </header>

        <Card style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Last Visit</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Condition</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', visit: 'Oct 24, 2023', condition: 'Hypertension' },
                { name: 'Jane Smith', visit: 'Nov 02, 2023', condition: 'Diabetes Type II' },
                { name: 'Michael Johnson', visit: 'Nov 14, 2023', condition: 'Asthma' },
              ].map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{p.visit}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500 }}>{p.condition}</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                     <Button size="sm" variant="outline">View Records</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
};

export default Patients;

