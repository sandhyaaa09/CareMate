import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Pill, TrendingUp, Bell, Loader2 } from 'lucide-react';
import { medicationService, appointmentService } from '../services/api';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [meds, setMeds] = useState([]);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medsRes, apptsRes] = await Promise.all([
          medicationService.getAll(),
          appointmentService.getAll()
        ]);
        setMeds(medsRes.data);
        setAppts(apptsRes.data.filter(a => a.status === 'CONFIRMED'));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextAppt = appts.length > 0 ? appts[0] : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        {/* Top bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Welcome back, <span style={{color: '#4f46e5'}}>{user?.fullName || 'Patient'}</span></h1>
            <p style={{ color: 'var(--text-secondary)' }}>You have {meds.length} active medications and {appts.length} upcoming appointments.</p>
          </div>
          <Card className="cm-card" style={{ padding: '0.5rem', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Bell size={20} />
          </Card>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <Card hover style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}><Pill size={24} color="#6366f1" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Medications</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{meds.length} Active</p>
                <p style={{ color: 'var(--color-success)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>100% adherence this week</p>
              </Card>

              <Card hover style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(236,72,153,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}><Calendar size={24} color="#ec4899" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Appointments</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{appts.length} Upcoming</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                  {nextAppt ? `Next: ${new Date(nextAppt.appointmentTime).toLocaleDateString()}` : 'No upcoming visits'}
                </p>
              </Card>

              <Card hover style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}><TrendingUp size={24} color="#10b981" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Health Score</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>85/100</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Based on recent tracking</p>
              </Card>
            </div>

            {/* Content rows */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <Card style={{ padding: '1.5rem', minHeight: '300px' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>Today's Timeline</h3>
                <div style={{ borderLeft: '2px solid rgba(99,102,241,0.2)', marginLeft: '1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {meds.length === 0 && appts.length === 0 ? (
                     <p style={{ color: 'var(--text-secondary)' }}>Nothing scheduled for today.</p>
                   ) : (
                     <>
                       {meds.slice(0, 3).map((med, idx) => (
                         <div key={idx} style={{ position: 'relative' }}>
                           <div style={{ position: 'absolute', left: '-1.95rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1' }}></div>
                           <h4 style={{ margin: '0 0 0.25rem 0' }}>{med.reminderTime}</h4>
                           <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Take {med.name} ({med.dosage})</p>
                         </div>
                       ))}
                       {nextAppt && (
                         <div style={{ position: 'relative' }}>
                           <div style={{ position: 'absolute', left: '-1.95rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: '#ec4899' }}></div>
                           <h4 style={{ margin: '0 0 0.25rem 0' }}>{new Date(nextAppt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                           <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Appointment: Dr. {nextAppt.doctor.fullName}</p>
                         </div>
                       )}
                     </>
                   )}
                </div>
              </Card>

              <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>AI Health Insights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: '0.75rem', border: '1px solid rgba(99,102,241,0.1)' }}>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>💡 Try drinking a glass of water 15 minutes before your morning vitamins for better absorption.</p>
                    </div>
                    <Button variant="outline" style={{ width: '100%' }}>Scan New Prescription</Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
