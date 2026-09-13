import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { Mail, Lock, ArrowRight, Loader2, Shield, User } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password.trim());
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', margin: 0 }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>
          Enter your credentials to access your financial dashboard
        </p>
      </div>

      {/* Quick Autofill Buttons for Testing */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '16px',
          backgroundColor: '#F8FAFD',
          border: '1px solid #E2EAF3',
          marginBottom: '18px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Quick Autofill:</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => fillCredentials('admin@elephant.com', 'admin123')}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              backgroundColor: '#EEE7FF',
              border: '1px solid #DDD0FF',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#6A38EB',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Shield size={12} /> Admin
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('nimsara@test.com', 'password123')}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              backgroundColor: '#E8F4FF',
              border: '1px solid #D0E8FF',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2196F3',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={12} /> User
          </button>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '6px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                backgroundColor: '#ffffff',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#29B6F6';
                e.target.style.boxShadow = '0 0 0 3px rgba(41, 182, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2EAF3';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                backgroundColor: '#ffffff',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#29B6F6';
                e.target.style.boxShadow = '0 0 0 3px rgba(41, 182, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2EAF3';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
            color: '#ffffff',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px -4px rgba(33, 150, 243, 0.38)',
            transition: 'all 0.15s ease',
            opacity: submitting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {submitting ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Signing in...
            </>
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#2196F3', fontWeight: 700 }}>
          Create an account
        </Link>
      </div>
    </div>
  );
};
