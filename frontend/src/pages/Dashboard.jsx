import React, { useCallback, useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import SummaryCards from '../components/SummaryCards';
import OrdersTable from '../components/OrdersTable';
import OrderModal from '../components/OrderModal';
import {
  fetchOrders,
  fetchSummary,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../api/orders';

const EMPTY_SUMMARY = {
  total: 0,
  overdue: 0,
  byStatus: { Pending: 0, 'In Progress': 0, Completed: 0, 'On Hold': 0, Cancelled: 0 },
};

const Dashboard = ({
  showSummary = true,
  detailedView = false,
}) => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit' | 'view', order }
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrders({ search, status: statusFilter });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const refreshAll = () => {
    loadOrders();
    loadSummary();
  };

  // Toggle a status filter when a summary card is clicked
  const toggleStatusFilter = (status) => {
    setStatusFilter((current) => (current === status ? '' : status));
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setFormError('');
    try {
      if (modal.mode === 'add') {
        await createOrder(formData);
      } else if (modal.mode === 'edit') {
        await updateOrder(modal.order.id, formData);
      }
      setModal(null);
      refreshAll();
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Something went wrong while saving the order.';
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (order) => {
    const confirmed = window.confirm(
      `Delete order "${order.id} — ${order.jobName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteOrder(order.id);
      refreshAll();
    } catch (err) {
      console.error('Failed to delete order:', err);
      window.alert('Failed to delete the order. Please try again.');
    }
  };

  const ReminderCard = ({ orders }) => {
  const today = new Date();

  const reminders = orders.filter(order => {
    if (!order.dueDate) return false;
    if (order.jobStatus === 'Completed') return false;

    const due = new Date(order.dueDate);
    const diffDays = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    return diffDays <= 3;
  });

  if (!reminders.length) return null;

  return (
    <div className="reminder-card">
      <h3>🔔 Due Date Reminders</h3>

      {reminders.map(order => (
        <div
          key={order.id}
          className="reminder-item"
        >
          <strong>{order.jobNo}</strong> — {order.jobName}
        </div>
      ))}
    </div>
  );
};

  return (
    <>
      <Topbar
        title={showSummary ? 'Dashboard' : 'Orders'}
        subtitle={
          showSummary
            ? 'Overview of all jobs and their current status'
            : 'Add, view, and manage every job order'
        }
        search={search}
        onSearchChange={setSearch}
        onAddOrder={() => {
          setFormError('');
          setModal({ mode: 'add', order: null });
        }}
      />

      <div className="page-content">

  {showSummary && (
    <ReminderCard orders={orders} />
  )}

  {showSummary && (
    <SummaryCards
      summary={summary}
      loading={summaryLoading}
      activeStatus={statusFilter}
      onToggleStatus={toggleStatusFilter}
    />
  )}

        {statusFilter && (
          <div className="active-filter">
            <span>Filtering by status: <strong>{statusFilter}</strong></span>
            <button type="button" onClick={() => setStatusFilter('')}>Clear</button>
          </div>
        )}

        <OrdersTable
  detailedView={detailedView}
  orders={orders}
  loading={loading}
  onView={(order) => setModal({ mode: 'view', order })}
  onEdit={(order) => {
    setFormError('');
    setModal({ mode: 'edit', order });
  }}
  onDelete={handleDelete}
/>
      </div>

      {modal && (
        <OrderModal
          mode={modal.mode}
          order={modal.order}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
          errorMessage={formError}
          onModeChange={(nextMode) => {
            setModal((current) =>
              current ? { ...current, mode: nextMode } : current
            );
          }}
        />
      )}
    </>
  );
};

export default Dashboard;