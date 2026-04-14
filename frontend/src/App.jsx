import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Patients from './pages/Patients';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import './index.css';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ className: 'glass-panel', style: { background: 'var(--bg-card)', color: 'var(--text-primary)' } }} />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Navigate to="/login?tab=signup" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRole="ROLE_PATIENT">
                <PatientDashboard />
              </ProtectedRoute>
            } />
          <Route path="/appointments" element={
            <ProtectedRoute allowedRole="ROLE_PATIENT">
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/medications" element={
            <ProtectedRoute allowedRole="ROLE_PATIENT">
              <Medications />
            </ProtectedRoute>
          } />
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute allowedRole="ROLE_DOCTOR">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRole="ROLE_DOCTOR">
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute allowedRole="ROLE_DOCTOR">
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Chatbot />
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
