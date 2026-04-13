import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Pill, Plus, Trash2, Clock, Loader2 } from 'lucide-react';
import { medicationService } from '../services/api';
import { toast } from 'react-hot-toast';

const Medications = () => {
  const { user } = useContext(AuthContext);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    reminderTime: '',
    frequency: 'Once Daily'
  });

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await medicationService.getAll();
      setMedications(response.data);
    } catch (err) {
      toast.error('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleAddMed = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await medicationService.add(newMed);
      toast.success('Medication added successfully!');
      setIsModalOpen(false);
      setNewMed({ name: '', dosage: '', reminderTime: '', frequency: 'Once Daily' });
      fetchMedications();
    } catch (err) {
      toast.error('Failed to add medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await medicationService.delete(deleteId);
      toast.success('Medication removed');
      setMedications(medications.filter(m => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={user?.role} />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Medications & Reminders</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your prescriptions and set smart reminders.</p>
          </div>
          <Button variant="primary" style={{ gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Medication
          </Button>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
          </div>
        ) : (
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Current Prescriptions</h3>
            {medications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <Pill size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No medications added yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {medications.map((med) => (
                  <Card key={med.id} style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                        <Pill size={24} color="#6366f1" />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(med.id)} style={{ color: 'var(--color-danger)', padding: '0.25rem' }}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{med.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{med.dosage} • {med.frequency}</p>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Clock size={14} color="#6366f1" />
                       <p style={{ margin: 0, fontSize: '0.875rem', color: '#6366f1', fontWeight: 500 }}>Reminder: {med.reminderTime}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Medication">
        <form onSubmit={handleAddMed} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input 
            label="Medication Name" 
            id="name" 
            value={newMed.name} 
            onChange={(e) => setNewMed({...newMed, name: e.target.value})} 
            required 
            placeholder="e.g. Amoxicillin"
          />
          <Input 
            label="Dosage" 
            id="dosage" 
            value={newMed.dosage} 
            onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} 
            required 
            placeholder="e.g. 500mg"
          />
          <Input 
            label="Reminder Time" 
            id="reminderTime" 
            type="time"
            value={newMed.reminderTime} 
            onChange={(e) => setNewMed({...newMed, reminderTime: e.target.value})} 
            required 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Frequency</label>
            <select 
              className="glass-input" 
              value={newMed.frequency} 
              onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              <option value="Once Daily">Once Daily</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="Three Times Daily">Three Times Daily</option>
              <option value="Every 8 Hours">Every 8 Hours</option>
            </select>
          </div>
          <Button type="submit" variant="primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isSubmitting}>
             {isSubmitting ? 'Adding...' : 'Add Medication'}
          </Button>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Are you sure you want to remove this medication? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, background: 'var(--color-danger)', border: 'none' }} onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Medications;
