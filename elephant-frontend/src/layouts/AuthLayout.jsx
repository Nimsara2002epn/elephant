import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/common/PageTransition';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F4F8FD 0%, #E8F4FF 50%, #DDF8F7 100%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft fintech ambient background glows */}
      <div
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(41, 182, 246, 0.18) 0%, rgba(255,255,255,0) 70%)',
          top: '-120px',
          right: '-120px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(221, 248, 247, 0.6) 0%, rgba(255,255,255,0) 70%)',
          bottom: '-100px',
          left: '-100px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 10px 25px -4px rgba(33, 150, 243, 0.35)',
              marginBottom: '14px',
            }}
          >
            🐘
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', margin: 0 }}>
            Elephant
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '6px', fontWeight: 500 }}>
            Smart Bill & Event Reminder System
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 20px 40px -10px rgba(33, 150, 243, 0.08), 0 8px 16px -4px rgba(13, 42, 91, 0.03)',
            border: '1px solid #E2EAF3',
          }}
        >
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
