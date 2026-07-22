import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-neutral-950 flex flex-col items-center justify-center text-slate-800 dark:text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-xs font-mono text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
};
