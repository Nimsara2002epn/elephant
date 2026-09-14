import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reportApi';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const FINTECH_PALETTE = ['#2196F3', '#29B6F6', '#088380', '#D81E6B', '#6A38EB', '#10B981', '#F59E0B'];

export const ReportsDashboardPage = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharts = async () => {
      try {
        setLoading(true);
        const data = await reportApi.getChartsData();
        setCharts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCharts();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Crunching financial & event analytics..." />;
  }

  // Transform category map to recharts array
  const categoryData = charts?.expensesByCategory
    ? Object.entries(charts.expensesByCategory).map(([name, value]) => ({
        name,
        value: Number(value),
      }))
    : [];

  // Transform monthly map to recharts array
  const monthlyData = charts?.monthlyExpenses
    ? Object.entries(charts.monthlyExpenses).map(([month, amount]) => ({
        month,
        amount: Number(amount),
      }))
    : [];

  // Transform event status counts
  const eventStatusData = charts?.eventStatusCounts
    ? Object.entries(charts.eventStatusCounts).map(([status, count]) => ({
        status,
        count: Number(count),
      }))
    : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0D2A5B', letterSpacing: '-0.02em', margin: 0 }}>
            Reports & Visual Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>
            Interactive expense breakdowns, monthly trend charts, and event completion metrics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/reports/history"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #E2EAF3',
              color: '#0D2A5B',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(13, 42, 91, 0.04)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4F8FD')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <FileText size={16} color="#2196F3" /> View Archive
          </Link>

          <Link
            to="/reports/history?generate=true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 8px 20px -4px rgba(33, 150, 243, 0.38)',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <TrendingUp size={16} /> Generate Report
          </Link>
        </div>
      </div>

      {/* Grid of 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        {/* Chart 1: Monthly Expense Trend */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#E8F4FF', color: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>
                Monthly Expenses Trend
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Amounts in LKR (Past 6 Months)</span>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F8" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Expenses']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #E2EAF3', boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.12)', fontWeight: 600, color: '#0D2A5B' }}
                />
                <Bar dataKey="amount" fill="#2196F3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Expenses by Category Donut */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EEE7FF', color: '#6A38EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>
                Expense Breakdown by Category
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Category distribution of all bills</span>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            {categoryData.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
                No bill category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={FINTECH_PALETTE[index % FINTECH_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Total']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #E2EAF3', boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.12)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Event Status Breakdown */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '26px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#DDF7EF', color: '#0E8058', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0D2A5B', margin: 0 }}>
                Event Status Completion
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Breakdown of scheduled vs completed</span>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF3F8" />
                <XAxis dataKey="status" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #E2EAF3', boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.12)' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
