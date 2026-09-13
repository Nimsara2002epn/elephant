import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <CheckCircle2 size={56} style={{ color: '#22C55E', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D2A5B', marginBottom: '8px' }}>
          Registration Successful!
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
          Your Elephant account is ready. Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', margin: 0 }}>
          Create Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>
          Join Elephant to manage bills, events & shared activities
        </p>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '4px' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Nimsara Wickramasinghe"
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '4px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '4px' }}>
            Phone (Optional)
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 71 234 5678"
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '4px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0D2A5B', marginBottom: '4px' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2EAF3',
                fontSize: '0.9rem',
                color: '#0D2A5B',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
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
            opacity: submitting ? 0.7 : 1,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {submitting ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Creating account...
            </>
          ) : (
            <>
              Register <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#2196F3', fontWeight: 700 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};
