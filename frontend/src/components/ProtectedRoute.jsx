import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Skeleton } from './ui/Skeleton';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center', padding: '2rem'}}>
        <Skeleton style={{width: '100%', height: '100%', borderRadius: '1rem'}} />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
