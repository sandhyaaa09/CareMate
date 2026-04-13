import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeartPulse } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';
import '../styles/pages.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initTab);
  const [forgotStep, setForgotStep] = useState('none'); // none, email, otp, reset
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient'
  });

  const [resetData, setResetData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleResetChange = (e) => {
    setResetData({...resetData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'login') {
        const data = await login(formData.email, formData.password);
        toast.success('Successfully logged in!');
        if (data.role === 'ROLE_PATIENT') {
          navigate('/dashboard');
        } else if (data.role === 'ROLE_DOCTOR') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/');
        }
      } else {
        await register(formData.fullName, formData.email, formData.password, formData.role);
        toast.success('Account created successfully! Please log in.');
        setActiveTab('login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(formData.email);
      toast.success('OTP sent to your email.');
      setForgotStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await authService.verifyOtp(formData.email, resetData.otp);
      toast.success('OTP verified. Set your new password.');
      setForgotStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (resetData.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }
    try {
      await authService.resetPassword(formData.email, resetData.otp, resetData.newPassword);
      toast.success('Password reset successfully! Please login.');
      setForgotStep('none');
      setResetData({ otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  const renderAuthHeader = (title, subtitle) => (
    <div style={{textAlign: 'center', marginBottom: '2rem'}}>
      <HeartPulse size={40} color="#4f46e5" style={{margin: '0 auto'}}/>
      <h2 style={{marginTop: '1rem', fontSize: '1.75rem'}}>{title}</h2>
      <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{subtitle}</p>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-left">
        <Card className="auth-card">
          {forgotStep === 'none' ? (
            <>
              {renderAuthHeader(
                activeTab === 'login' ? 'Welcome Back' : 'Create an Account',
                activeTab === 'login' ? 'Please enter your details to sign in.' : 'Join CareMate to manage your health.'
              )}

              <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                <Button 
                  variant={activeTab === 'login' ? 'primary' : 'ghost'} 
                  style={{flex: 1}} 
                  onClick={() => setActiveTab('login')}
                >Login</Button>
                <Button 
                  variant={activeTab === 'signup' ? 'primary' : 'ghost'} 
                  style={{flex: 1}} 
                  onClick={() => setActiveTab('signup')}
                >Sign Up</Button>
              </div>

              <form onSubmit={handleSubmit}>
                {activeTab === 'signup' && (
                  <>
                    <Input label="Full Name" id="fullName" value={formData.fullName} onChange={handleChange} required />
                    <div style={{marginBottom: '1rem'}}>
                      <label style={{fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem'}}>I am a:</label>
                      <select 
                        id="role" 
                        value={formData.role} 
                        onChange={handleChange}
                        style={{width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'transparent', color: 'var(--text-primary)'}}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                      </select>
                    </div>
                  </>
                )}
                
                <Input label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} required />
                <Input label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
                
                {activeTab === 'login' && (
                  <div style={{textAlign: 'right', marginBottom: '1.5rem'}}>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setForgotStep('email'); }} 
                      style={{fontSize: '0.875rem'}}
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                <Button type="submit" variant="primary" style={{width: '100%'}}>
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {forgotStep === 'email' && (
                <>
                  {renderAuthHeader('Forgot Password', 'Enter your email to receive an OTP.')}
                  <form onSubmit={handleForgotPassword}>
                    <Input label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} required />
                    <Button type="submit" variant="primary" style={{width: '100%', marginBottom: '1rem'}}>Send OTP</Button>
                    <Button variant="ghost" style={{width: '100%'}} onClick={() => setForgotStep('none')}>Back to Login</Button>
                  </form>
                </>
              )}

              {forgotStep === 'otp' && (
                <>
                  {renderAuthHeader('Verify OTP', 'Enter the 6-digit code sent to your email.')}
                  <form onSubmit={handleVerifyOtp}>
                    <Input label="6-Digit OTP" id="otp" type="text" maxLength="6" value={resetData.otp} onChange={handleResetChange} required />
                    <Button type="submit" variant="primary" style={{width: '100%', marginBottom: '1rem'}}>Verify OTP</Button>
                    <Button variant="ghost" style={{width: '100%'}} onClick={() => setForgotStep('email')}>Resend OTP</Button>
                  </form>
                </>
              )}

              {forgotStep === 'reset' && (
                <>
                  {renderAuthHeader('Reset Password', 'Create a new secure password for your account.')}
                  <form onSubmit={handleResetPassword}>
                    <Input label="New Password" id="newPassword" type="password" value={resetData.newPassword} onChange={handleResetChange} required />
                    <Input label="Confirm New Password" id="confirmPassword" type="password" value={resetData.confirmPassword} onChange={handleResetChange} required />
                    <Button type="submit" variant="primary" style={{width: '100%', marginBottom: '1rem'}}>Reset Password</Button>
                  </form>
                </>
              )}
            </>
          )}
        </Card>
      </div>
      <div className="auth-right">
         <h1 style={{fontSize: '3rem', fontWeight: 800, color: '#4f46e5', marginBottom: '1rem'}}>CareMate</h1>
         <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center'}}>
            Your premium health dashboard. Stay on top of your schedule and your health effortlessly.
         </p>
      </div>
    </div>
  );
};

export default Login;
