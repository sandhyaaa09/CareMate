import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, Bell, Activity, Sparkles } from 'lucide-react';
import '../styles/pages.css';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      
      <main className="landing-hero">
        <div style={{marginTop: '4rem'}}>
          <h1 className="hero-title">Your AI Healthcare Companion</h1>
          <p className="hero-subtitle">
            Seamlessly manage your medication reminders, book doctor appointments, and unlock actionable health insights with advanced AI.
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <Link to="/login?tab=signup">
              <Button size="lg" variant="primary">Get Started Today</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </main>

      <section className="feature-grid">
        <Card>
          <Bell size={32} color="#6366f1" style={{marginBottom: '1rem'}}/>
          <h3 style={{marginBottom: '0.5rem'}}>Smart Reminders</h3>
          <p style={{color: 'var(--text-secondary)'}}>Never miss a dose. Automated emails and dashboard alerts keep you completely on track.</p>
        </Card>
        
        <Card>
          <Calendar size={32} color="#ec4899" style={{marginBottom: '1rem'}}/>
          <h3 style={{marginBottom: '0.5rem'}}>Easy Scheduling</h3>
          <p style={{color: 'var(--text-secondary)'}}>Book appointments effortlessly and let your doctor review requests online.</p>
        </Card>

        <Card>
          <Sparkles size={32} color="#10b981" style={{marginBottom: '1rem'}}/>
          <h3 style={{marginBottom: '0.5rem'}}>AI Insights</h3>
          <p style={{color: 'var(--text-secondary)'}}>Upload prescriptions to instantly extract medication schedules and personalized AI advice.</p>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
