import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { billApi } from '../../api/billApi';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Search, Edit2, Trash2, CheckCircle2, RotateCcw, Receipt, AlertCircle } from 'lucide-react';

export const BillsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsData, statsData, catsData] = await Promise.all([
        billApi.getBills({ status: statusFilter, category: categoryFilter }),
        billApi.getStats(),
        billApi.getCategories(),
      ]);
      setBills(billsData || []);
      setStats(statsData);
      setCategories(catsData || []);
    } catch (e) {
      console.error('Failed to load bills:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter]);

  const handlePay = async (id) => {
    try {
      await billApi.markAsPaid(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnpay = async (id) => {
    try {
      await billApi.markAsUnpaid(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await billApi.deleteBill(deleteTargetId);
      setDeleteTargetId(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBills = bills.filter((b) =>
    searchTerm ? b.title?.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div>
      <PageHeader
        title="Bills Management"
        subtitle="Track, organize, and manage your expenses, subscriptions, and due dates"
        breadcrumb="Expenses / Bills"
        action={
          <button
            onClick={() => navigate('/bills/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #29B6F6 0%, #2196F3 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(33, 150, 243, 0.38)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Plus size={18} /> New Bill
          </button>
        }
      />

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          <StatCard title="Total Bills" value={stats.total} subtitle={formatCurrency(stats.totalAmount)} icon={Receipt} color="blue" />
          <StatCard title="Paid Amount" value={formatCurrency(stats.paidAmount)} subtitle={`${stats.paid} bills paid`} icon={CheckCircle2} color="green" />
          <StatCard title="Outstanding" value={formatCurrency(stats.unpaidAmount)} subtitle={`${stats.unpaid} unpaid`} icon={RotateCcw} color="amber" />
          <StatCard title="Overdue Bills" value={stats.overdue} subtitle="Requires urgent payment" icon={AlertCircle} color="red" />
        </div>
      )}

      {/* Filters Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '16px 22px',
          border: '1px solid #E2EAF3',
          boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '22px',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search bills by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: '12px',
              border: '1.5px solid #E2EAF3',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
              color: '#0D2A5B',
              backgroundColor: '#ffffff',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#29B6F6')}
            onBlur={(e) => (e.target.style.borderColor = '#E2EAF3')}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1.5px solid #E2EAF3',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
            color: '#0D2A5B',
            fontWeight: 600,
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1.5px solid #E2EAF3',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
            color: '#0D2A5B',
            fontWeight: 600,
            outline: 'none',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Bills Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #E2EAF3',
          boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <LoadingSpinner message="Loading bills..." />
        ) : filteredBills.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No bills found"
            message="You don't have any bills matching the selected filters."
            actionText="Create Bill"
            onAction={() => navigate('/bills/new')}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFD', borderBottom: '1px solid #E2EAF3' }}>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</th>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</th>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amount</th>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Due Date</th>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((b) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: '1px solid #EEF3F8',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFD')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <td style={{ padding: '16px 22px', fontWeight: 700, color: '#0D2A5B' }}>
                      {b.title}
                      {b.recurring && (
                        <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#2196F3', backgroundColor: '#E8F4FF', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                          {b.recurringFrequency || 'Recurring'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 22px', color: '#64748B', fontWeight: 500 }}>
                      {b.category || '—'}
                    </td>
                    <td style={{ padding: '16px 22px', fontWeight: 800, color: '#0D2A5B' }}>
                      {formatCurrency(b.amount)}
                    </td>
                    <td style={{ padding: '16px 22px', color: '#64748B', fontWeight: 500 }}>
                      {formatDate(b.dueDate)}
                    </td>
                    <td style={{ padding: '16px 22px' }}>
                      <StatusBadge status={b.status} />
                    </td>
                    <td style={{ padding: '16px 22px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {b.status === 'PAID' ? (
                          <button
                            onClick={() => handleUnpay(b.id)}
                            title="Mark as unpaid"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '9999px',
                              backgroundColor: '#FFF8E6',
                              border: '1px solid #FCE7B8',
                              color: '#B45309',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Unpay
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePay(b.id)}
                            title="Mark as paid"
                            style={{
                              padding: '6px 14px',
                              borderRadius: '9999px',
                              backgroundColor: '#DDF7EF',
                              border: '1px solid #C0EFE0',
                              color: '#0E8058',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Pay
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/bills/${b.id}/edit`)}
                          title="Edit bill"
                          style={{
                            padding: '7px',
                            borderRadius: '10px',
                            backgroundColor: '#E8F4FF',
                            border: '1px solid #D0E8FF',
                            color: '#2196F3',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(b.id)}
                          title="Delete bill"
                          style={{
                            padding: '7px',
                            borderRadius: '10px',
                            backgroundColor: '#FFE8F1',
                            border: '1px solid #FFCCD8',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Bill"
        message="Are you sure you want to delete this bill record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
