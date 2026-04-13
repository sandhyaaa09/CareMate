import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Calendar, Plus, Clock, User, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { appointmentService } from '../services/api';
import { toast } from 'react-hot-toast';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    doctorId: '',
    appointmentTime: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, docsRes] = await Promise.all([
        appointmentService.getAll(),
        user?.role === 'ROLE_PATIENT' ? appointmentService.getDoctors() : Promise.resolve({ data: [] })
      ]);
      setAppointments(apptsRes.data || []);
      const docsData = docsRes.data || [];
      setDoctors(docsData);
      if (docsData.length > 0) {
        setBookingData(prev => ({ ...prev, doctorId: docsData[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await appointmentService.book(bookingData);
      toast.success('Appointment booked successfully!');
      setIsModalOpen(false);
      setBookingData({ doctorId: doctors[0]?.id || '', appointmentTime: '', reason: '' });
      fetchData();
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to book appointment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const isDoctor = user?.role === 'ROLE_DOCTOR';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Appointments</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your healthcare schedule.</p>
          </div>
          {!isDoctor && (
            <Button variant="primary" style={{ gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Book Appointment
            </Button>
          )}
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
          </div>
        ) : (
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Upcoming Appointments</h3>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No appointments found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map((apt) => (
                  <div key={apt.id} style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '0.75rem' }}>
                        <Calendar size={28} color="#6366f1" />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                          {isDoctor ? apt.patient.fullName : `Dr. ${apt.doctor.fullName}`}
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                          {apt.reason} • {new Date(apt.appointmentTime).toLocaleString()}
                        </p>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: apt.status === 'PENDING' ? 'var(--color-warning)' : apt.status === 'CONFIRMED' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                           {apt.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isDoctor && apt.status === 'PENDING' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')} style={{ color: 'var(--color-success)', gap: '0.25rem' }}>
                            <CheckCircle size={16} /> Accept
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')} style={{ color: 'var(--color-danger)', gap: '0.25rem' }}>
                            <XCircle size={16} /> Decline
                          </Button>
                        </>
                      )}
                      {!isDoctor && apt.status === 'PENDING' && (
                         <Button variant="ghost" style={{ color: '#ef4444' }}>Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book New Appointment">
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select Doctor</label>
            <select 
              className="glass-input" 
              value={bookingData.doctorId} 
              onChange={(e) => setBookingData({...bookingData, doctorId: e.target.value})}
              required
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>Dr. {doc.fullName}</option>
              ))}
            </select>
          </div>
          <Input 
            label="Date & Time" 
            id="appointmentTime" 
            type="datetime-local"
            value={bookingData.appointmentTime} 
            onChange={(e) => setBookingData({...bookingData, appointmentTime: e.target.value})} 
            required 
          />
          <Input 
            label="Reason for Visit" 
            id="reason" 
            value={bookingData.reason} 
            onChange={(e) => setBookingData({...bookingData, reason: e.target.value})} 
            required 
            placeholder="e.g. Chest pain, regular checkup"
          />
          <Button type="submit" variant="primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isSubmitting}>
             {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
