import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import { billApi } from '../../api/billApi';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { CalendarBillModal } from '../../components/calendar/CalendarBillModal';
import { CalendarEventModal } from '../../components/calendar/CalendarEventModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Receipt,
  List,
  Grid3X3,
  CalendarDays,
} from 'lucide-react';

export const CalendarPage = () => {
  const navigate = useNavigate();
  const [calendarItems, setCalendarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar View State
  const [viewDate, setViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'
  const [itemTypeFilter, setItemTypeFilter] = useState('ALL'); // 'ALL' | 'EVENT' | 'BILL'

  // Selected item modal states
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Delete confirm state
  const [deleteItem, setDeleteItem] = useState(null); // { id, type: 'BILL' | 'EVENT' }

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await eventApi.getCalendarItems();
      setCalendarItems(data || []);
    } catch (e) {
      console.error('Failed to load calendar events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ── Month Navigation Helpers ─────────────────────────────────────────────

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setViewDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const currentMonthLabel = `${monthNames[currentMonth]} ${currentYear}`;

  // ── Build Month Grid Matrix ──────────────────────────────────────────────

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Next month filler days (to complete 5 or 6 full weeks: 35 or 42 cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const nextMonthDays = totalCells - days.length;
    for (let n = 1; n <= nextMonthDays; n++) {
      const nextDate = new Date(currentYear, currentMonth + 1, n);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNumber: n,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Group items by date: { 'YYYY-MM-DD': [item1, item2] }
  const itemsByDate = useMemo(() => {
    const map = {};
    for (const item of calendarItems) {
      if (itemTypeFilter !== 'ALL' && item.itemType !== itemTypeFilter) {
        continue;
      }
      const d = item.start; // format 'YYYY-MM-DD'
      if (!map[d]) map[d] = [];
      map[d].push(item);
    }
    return map;
  }, [calendarItems, itemTypeFilter]);

  // Filtered items list for Agenda view
  const filteredItems = useMemo(() => {
    return calendarItems
      .filter((it) => (itemTypeFilter === 'ALL' ? true : it.itemType === itemTypeFilter))
      .sort((a, b) => (a.start > b.start ? 1 : -1));
  }, [calendarItems, itemTypeFilter]);

  // ── Modal Actions ────────────────────────────────────────────────────────

  const handleItemClick = async (item) => {
    if (item.itemType === 'BILL') {
      try {
        const fullBill = await billApi.getBill(item.id);
        setSelectedBill(fullBill);
      } catch (e) {
        // Fallback to basic object if fetch fails
        setSelectedBill({
          id: item.id,
          title: item.title,
          dueDate: item.start,
          status: item.billStatus || 'UNPAID',
        });
      }
    } else {
      try {
        const fullEvent = await eventApi.getEvent(item.id);
        setSelectedEvent(fullEvent);
      } catch (e) {
        setSelectedEvent({
          id: item.id,
          title: item.title,
          eventDate: item.start,
          eventTime: item.eventTime,
          location: item.eventLocation,
          status: item.eventStatus || 'SCHEDULED',
        });
      }
    }
  };

  const handlePayBill = async (id) => {
    try {
      await billApi.payBill(id);
      setSelectedBill(null);
      loadItems();
    } catch (e) {
      console.error('Failed to pay bill:', e);
    }
  };

  const handleUnpayBill = async (id) => {
    try {
      await billApi.unpayBill(id);
      setSelectedBill(null);
      loadItems();
    } catch (e) {
      console.error('Failed to unpay bill:', e);
    }
  };

  const handleCompleteEvent = async (id) => {
    try {
      await eventApi.completeEvent(id);
      setSelectedEvent(null);
      loadItems();
    } catch (e) {
      console.error('Failed to complete event:', e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      if (deleteItem.type === 'BILL') {
        await billApi.deleteBill(deleteItem.id);
        setSelectedBill(null);
      } else {
        await eventApi.deleteEvent(deleteItem.id);
        setSelectedEvent(null);
      }
      setDeleteItem(null);
      loadItems();
    } catch (e) {
      console.error('Failed to delete item:', e);
    }
  };

  return (
    <div>
      <PageHeader
        title="Event & Bill Calendar"
        subtitle="Visual timeline of all scheduled events, activities, and due bills."
        breadcrumb="Events / Calendar"
        action={
          <button
            onClick={() => navigate('/events/new')}
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
            <Plus size={18} /> Add Event
          </button>
        }
      />

      {/* Calendar Toolbar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '16px 22px',
          border: '1px solid #E2EAF3',
          boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
          marginBottom: '18px',
        }}
      >
        {/* Navigation & Current Month */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #E2EAF3',
                backgroundColor: '#ffffff',
                color: '#0D2A5B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8F4FF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              title="Next Month"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #E2EAF3',
                backgroundColor: '#ffffff',
                color: '#0D2A5B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8F4FF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={handleToday}
            style={{
              padding: '7px 16px',
              borderRadius: '9999px',
              border: '1px solid #E2EAF3',
              backgroundColor: '#F4F8FD',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: '#0D2A5B',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8F4FF';
              e.currentTarget.style.color = '#2196F3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F4F8FD';
              e.currentTarget.style.color = '#0D2A5B';
            }}
          >
            Today
          </button>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0D2A5B', margin: '0 0 0 8px', letterSpacing: '-0.01em' }}>
            {currentMonthLabel}
          </h2>
        </div>

        {/* View Mode & Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F4F8FD', padding: '4px', borderRadius: '9999px', border: '1px solid #E2EAF3' }}>
            <button
              onClick={() => setItemTypeFilter('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: itemTypeFilter === 'ALL' ? '#ffffff' : 'transparent',
                color: itemTypeFilter === 'ALL' ? '#0D2A5B' : '#64748B',
                fontWeight: itemTypeFilter === 'ALL' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: itemTypeFilter === 'ALL' ? '0 2px 6px rgba(13,42,91,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              All Items
            </button>
            <button
              onClick={() => setItemTypeFilter('EVENT')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: itemTypeFilter === 'EVENT' ? '#ffffff' : 'transparent',
                color: itemTypeFilter === 'EVENT' ? '#2196F3' : '#64748B',
                fontWeight: itemTypeFilter === 'EVENT' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: itemTypeFilter === 'EVENT' ? '0 2px 6px rgba(13,42,91,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Events
            </button>
            <button
              onClick={() => setItemTypeFilter('BILL')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: itemTypeFilter === 'BILL' ? '#ffffff' : 'transparent',
                color: itemTypeFilter === 'BILL' ? '#0E8058' : '#64748B',
                fontWeight: itemTypeFilter === 'BILL' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: itemTypeFilter === 'BILL' ? '0 2px 6px rgba(13,42,91,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Bills
            </button>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F4F8FD', padding: '4px', borderRadius: '9999px', border: '1px solid #E2EAF3' }}>
            <button
              onClick={() => setViewMode('month')}
              title="Month Grid View"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'month' ? '#2196F3' : 'transparent',
                color: viewMode === 'month' ? '#ffffff' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: viewMode === 'month' ? '0 2px 6px rgba(33,150,243,0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Grid3X3 size={14} /> Month
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              title="Agenda List View"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'agenda' ? '#2196F3' : 'transparent',
                color: viewMode === 'agenda' ? '#ffffff' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: viewMode === 'agenda' ? '0 2px 6px rgba(33,150,243,0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <List size={14} /> Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid #E2EAF3',
          marginBottom: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(13,42,91,0.02)',
        }}
      >
        <span style={{ color: '#64748B' }}>Legend:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#2196F3' }} />
          <span style={{ color: '#0D2A5B' }}>Event</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#F59E0B' }} />
          <span style={{ color: '#0D2A5B' }}>Bill Due</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#EF4444' }} />
          <span style={{ color: '#0D2A5B' }}>Overdue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#22C55E' }} />
          <span style={{ color: '#0D2A5B' }}>Completed</span>
        </div>
      </div>

      {/* Calendar Main Container */}
      {loading ? (
        <LoadingSpinner message="Loading calendar items..." />
      ) : viewMode === 'month' ? (
        /* Month Grid View */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.07)',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          {/* Day of Week Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              backgroundColor: '#F8FAFD',
              borderBottom: '1px solid #E2EAF3',
              textAlign: 'center',
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={d}
                style={{
                  padding: '14px 0',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: i === 0 || i === 6 ? '#64748B' : '#0D2A5B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Cells Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              backgroundColor: '#EEF3F8',
              gap: '1px',
            }}
          >
            {calendarDays.map((cell) => {
              const dayItems = itemsByDate[cell.dateStr] || [];

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => navigate(`/events/new?date=${cell.dateStr}`)}
                  style={{
                    minHeight: '110px',
                    backgroundColor: cell.isCurrentMonth ? '#ffffff' : '#F8FAFD',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (cell.isCurrentMonth) e.currentTarget.style.backgroundColor = '#F4F8FD';
                  }}
                  onMouseLeave={(e) => {
                    if (cell.isCurrentMonth) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  {/* Date Number Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: cell.isToday ? 800 : cell.isCurrentMonth ? 700 : 400,
                        color: cell.isToday ? '#ffffff' : cell.isCurrentMonth ? '#0D2A5B' : '#94A3B8',
                        backgroundColor: cell.isToday ? '#2196F3' : 'transparent',
                        width: cell.isToday ? '24px' : 'auto',
                        height: cell.isToday ? '24px' : 'auto',
                        borderRadius: cell.isToday ? '50%' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cell.dayNumber}
                    </span>

                    {dayItems.length > 0 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Item Pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                    {dayItems.map((item) => (
                      <div
                        key={`${item.itemType}_${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering day cell click
                          handleItemClick(item);
                        }}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '8px',
                          backgroundColor: item.color || '#2196F3',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 4px rgba(13,42,91,0.12)',
                          cursor: 'pointer',
                        }}
                        title={item.title}
                      >
                        {item.itemType === 'BILL' ? <Receipt size={11} /> : <CalendarIcon size={11} />}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title?.replace('📅 ', '').replace('💳 ', '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda List View */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #E2EAF3',
            boxShadow: '0 10px 25px -5px rgba(33, 150, 243, 0.06)',
            marginBottom: '24px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B' }}>
              <CalendarDays size={40} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0D2A5B', margin: '0 0 4px' }}>No Items Found</h4>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>There are no events or bills matching your current filter.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredItems.map((item) => (
                <div
                  key={`${item.itemType}_${item.id}`}
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: '#F8FAFD',
                    border: '1px solid #E2EAF3',
                    borderLeft: `5px solid ${item.color || '#2196F3'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E8F4FF';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFD';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        color: item.color || '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(13,42,91,0.05)',
                      }}
                    >
                      {item.itemType === 'BILL' ? <Receipt size={20} /> : <CalendarIcon size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0D2A5B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', display: 'flex', gap: '12px' }}>
                        <span>📅 {item.start}</span>
                        {item.eventTime && <span>⏰ {item.eventTime}</span>}
                        {item.eventLocation && <span>📍 {item.eventLocation}</span>}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#ffffff',
                      color: item.color || '#2196F3',
                      border: '1px solid #E2EAF3',
                    }}
                  >
                    {item.itemType === 'BILL' ? (item.billStatus || 'BILL') : (item.eventStatus || 'EVENT')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bill Details Modal */}
      <CalendarBillModal
        isOpen={!!selectedBill}
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onPay={handlePayBill}
        onUnpay={handleUnpayBill}
        onDelete={(id) => setDeleteItem({ id, type: 'BILL' })}
      />

      {/* Event Details Modal */}
      <CalendarEventModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onComplete={handleCompleteEvent}
        onDelete={(id) => setDeleteItem({ id, type: 'EVENT' })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        title={deleteItem?.type === 'BILL' ? 'Delete Bill' : 'Delete Event'}
        message={`Are you sure you want to delete this ${deleteItem?.type === 'BILL' ? 'bill' : 'event'}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
};
