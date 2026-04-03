import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, CalendarCheck, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { appointmentService } from '../services/api';
import { toast } from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err) {
      console.error('Failed to fetch doctor dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      toast.success(`Request ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const pendingRequests = appointments.filter(a => a.status === 'PENDING');
  const todayConfirmed = appointments.filter(a => a.status === 'CONFIRMED');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Dr. <span style={{color: '#4f46e5'}}>{user?.fullName || 'Health Specialist'}</span></h1>
            <p style={{ color: 'var(--text-secondary)' }}>Here's your clinic overview for today.</p>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
               <Card hover style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}><Users size={24} color="#6366f1" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Today's Patients</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{todayConfirmed.length} Scheduled</p>
              </Card>

              <Card hover style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}><CalendarCheck size={24} color="#10b981" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Appointment Requests</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{pendingRequests.length} Pending</p>
              </Card>
            </div>

            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0' }}>Recent Appointment Requests</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <th style={{ padding: '1rem 0' }}>Patient Name</th>
                      <th style={{ padding: '1rem 0' }}>Requested Time</th>
                      <th style={{ padding: '1rem 0' }}>Reason</th>
                      <th style={{ padding: '1rem 0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No pending requests.</td>
                      </tr>
                    ) : (
                      pendingRequests.map((apt) => (
                        <tr key={apt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '1rem 0', fontWeight: 500 }}>{apt.patient.fullName}</td>
                          <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                             {new Date(apt.appointmentTime).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{apt.reason}</td>
                          <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                             <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')} style={{ gap: '0.25rem', padding: '0.5rem 0.75rem' }}>
                               <CheckCircle size={14} /> Approve
                             </Button>
                             <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')} style={{ gap: '0.25rem', padding: '0.5rem 0.75rem', color: 'var(--color-danger)' }}>
                               <XCircle size={14} /> Reject
                             </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
