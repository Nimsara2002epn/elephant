import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Users, FileText, Database, Server, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getSystemStatus();
        setStatus(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading system diagnostics..." />;
  }

  const memoryPercent = status?.maxMemoryMb
    ? Math.round((status.usedMemoryMb / status.maxMemoryMb) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Admin Control Center"
        subtitle="System health, security audit monitoring, user permissions, and database recovery"
        breadcrumb="Administration / System Overview"
      />

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <Link
          to="/admin/users"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(33, 150, 243, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(33, 150, 243, 0.06)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E8F4FF', color: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>User Management</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>Manage roles & toggle status</p>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: '#2196F3' }} />
        </Link>

        <Link
          to="/admin/logs"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(33, 150, 243, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(33, 150, 243, 0.06)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#EEE7FF', color: '#6A38EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>Security Logs</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>Audit trail & clean records</p>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: '#6A38EB' }} />
        </Link>

        <Link
          to="/admin/backups"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 16px 32px -4px rgba(33, 150, 243, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(33, 150, 243, 0.06)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#DDF7EF', color: '#0E8058', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>Database Backups</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>Snapshots & data restore</p>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: '#0E8058' }} />
        </Link>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Total Registered Users" value={status?.totalUsers || 0} subtitle={`${status?.activeUsers || 0} active accounts`} icon={Users} color="blue" />
        <StatCard title="Database Status" value={status?.dbStatus || 'Online'} subtitle="MySQL 8.0 Connected" icon={CheckCircle2} color="green" />
        <StatCard title="Security Log Entries" value={status?.totalLogs || 0} subtitle="Audit entries captured" icon={Activity} color="purple" />
        <StatCard title="System Backups" value={status?.totalBackups || 0} subtitle="Recovery points available" icon={Database} color="amber" />
      </div>

      {}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '30px',
          border: '1px solid #E2EAF3',
          boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E8F4FF', color: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Server size={20} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>
            JVM & Hardware Health
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#F8FAFD', padding: '20px', borderRadius: '16px', border: '1px solid #EEF3F8' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Memory Utilization ({memoryPercent}%)</span>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2EAF3', borderRadius: '9999px', overflow: 'hidden', margin: '10px 0' }}>
              <div style={{ width: `${memoryPercent}%`, height: '100%', backgroundColor: memoryPercent > 80 ? '#EF4444' : '#2196F3', borderRadius: '9999px' }} />
            </div>
            <div style={{ fontSize: '0.825rem', color: '#0D2A5B', fontWeight: 600 }}>
              Used: <strong>{status?.usedMemoryMb} MB</strong> / Max: <strong>{status?.maxMemoryMb} MB</strong>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFD', padding: '20px', borderRadius: '16px', border: '1px solid #EEF3F8' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Available CPU Processors</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0D2A5B', margin: '6px 0' }}>
              {status?.processors || 1} Cores
            </div>
            <span style={{ fontSize: '0.75rem', color: '#0E8058', fontWeight: 700 }}>Thread Pool Operational</span>
          </div>

          <div style={{ backgroundColor: '#F8FAFD', padding: '20px', borderRadius: '16px', border: '1px solid #EEF3F8' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Server Local Time</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0D2A5B', margin: '8px 0' }}>
              {status?.serverTime || '—'}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Timezone Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
