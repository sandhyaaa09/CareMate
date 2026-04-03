import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, Plus, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { appointmentService } from '../services/api';
import { toast } from 'react-hot-toast';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err) {
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const isDoctor = user?.role === 'ROLE_DOCTOR';
  
  // Timeline hours from 8 AM to 8 PM
  const hours = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const getAppointmentsForHour = (hourStr) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentTime);
      const ampm = aptDate.getHours() >= 12 ? 'PM' : 'AM';
      let hours = aptDate.getHours() % 12;
      hours = hours ? hours : 12;
      const formattedAptHour = `${hours.toString().padStart(2, '0')}:00 ${ampm}`;
      return formattedAptHour === hourStr && apt.status !== 'CANCELLED';
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>My Schedule</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View and manage your upcoming calendar.</p>
          </div>
          <Button variant="primary" style={{ gap: '0.5rem' }}>
            <Plus size={20} />
            {isDoctor ? 'Block Time' : 'Book New'}
          </Button>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
             <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
          </div>
        ) : (
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ margin: 0 }}>Today Setup</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                 <CalendarIcon size={16} />
                 {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
               {hours.map((time, idx) => {
                 const hourAppointments = getAppointmentsForHour(time);
                 return (
                  <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', minHeight: '60px' }}>
                    <div style={{ width: '80px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', paddingTop: '4px' }}>{time}</div>
                    <div style={{ flex: 1, borderTop: '1px solid rgba(0,0,0,0.05)', position: 'relative', height: '100%' }}>
                       {hourAppointments.map(apt => (
                         <div key={apt.id} style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', background: isDoctor ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', borderLeft: `4px solid ${isDoctor ? '#6366f1' : '#10b981'}`, padding: '0.75rem 1rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontWeight: 700, color: isDoctor ? '#4f46e5' : '#059669', fontSize: '0.9rem' }}>{apt.reason}</span>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  With {isDoctor ? apt.patient.fullName : `Dr. ${apt.doctor.fullName}`}
                                </p>
                              </div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '1rem', textTransform: 'uppercase' }}>{apt.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                 );
               })}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Schedule;

