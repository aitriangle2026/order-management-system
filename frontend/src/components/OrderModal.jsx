import React, { useEffect, useState } from 'react';
import { X, Pencil } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ORDER_SOURCES, JOB_STATUSES } from '../api/orders';
import { formatDate, toInputDate } from '../utils/format';

const EMPTY_FORM = {
  jobNo: '',
  jobName: '',
  orderSource: '',
  jobOwner: '',
  assignPerson: '',
  startDate: '',
  dueDate: '',
  jobStatus: JOB_STATUSES[0],
  endDate: '',
  projectCost: '',
  projectExpenses: '',
  remarks: '',
};

// mode: 'add' | 'edit' | 'view'
const OrderModal = ({
  mode,
  order,
  onClose,
  onSave,
  saving,
  errorMessage,
  onModeChange,
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewMode, setViewMode] = useState(mode); // allows switching view -> edit in place

  useEffect(() => {
    if (order) {
      setForm({
        jobNo: order.jobNo || '',
        jobName: order.jobName || '',
        orderSource: order.orderSource || '',
        jobOwner: order.jobOwner || '',
        assignPerson: order.assignPerson || '',
        startDate: toInputDate(order.startDate),
        dueDate: toInputDate(order.dueDate),
        jobStatus: order.jobStatus || JOB_STATUSES[0],
        endDate: toInputDate(order.endDate),
        projectCost: order.projectCost || '',
projectExpenses: order.projectExpenses || '',
        remarks: order.remarks || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setViewMode(mode);
  }, [order, mode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const isReadOnly = viewMode === 'view';
  const titleMap = {
    add: 'New Order',
    edit: 'Edit Order',
    view: 'Order Details',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>{titleMap[viewMode]}</h2>
            {order?.jobNo && <span className="job-chip job-chip-lg">{order.id}</span>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} title="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        {isReadOnly ? (
          <div className="view-grid">
            <ViewField label="Job No" value={order.jobNo} mono />
            <ViewField label="Job Name" value={order.jobName} />
            <ViewField label="Order Source" value={order.orderSource} />
            <ViewField label="Job Owner" value={order.jobOwner} />
            <ViewField label="Assign Person" value={order.assignPerson} />
            <ViewField label="Start Date" value={formatDate(order.startDate)} mono />
            <ViewField label="Due Date" value={formatDate(order.dueDate)} mono />
            <div className="view-field">
              <span className="view-label">Job Status</span>
              <StatusBadge status={order.jobStatus} />
            </div>
            <ViewField label="End Date" value={formatDate(order.endDate)} mono />
            <ViewField
  label="Project Cost"
  value={`Rs. ${order.projectCost || 0}`}
/>

<ViewField
  label="Project Expenses"
  value={`Rs. ${order.projectExpenses || 0}`}
/>

<ViewField
  label="Profit"
  value={`Rs. ${order.profit || 0}`}
/>
            <div className="view-field view-field-full">
              <span className="view-label">Remarks</span>
              <p className="view-remarks">{order.remarks || '—'}</p>
            </div>
          </div>
        ) : (
          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              

              <div className="form-field">
                <label htmlFor="jobName">Job Name</label>
                <input
                  id="jobName"
                  type="text"
                  placeholder="e.g. Brand identity refresh"
                  value={form.jobName}
                  onChange={handleChange('jobName')}
                  required
                />
              </div>

              <div className="form-field">
  <label htmlFor="orderSource">Order Source</label>
  <input
    id="orderSource"
    type="text"
    placeholder="e.g. Facebook, Website, WhatsApp, Referral"
    value={form.orderSource}
    onChange={handleChange('orderSource')}
  />
</div>

              <div className="form-field">
                <label htmlFor="jobStatus">Job Status</label>
                <select
                  id="jobStatus"
                  value={form.jobStatus}
                  onChange={handleChange('jobStatus')}
                >
                  {JOB_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="jobOwner">Job Owner</label>
                <input
                  id="jobOwner"
                  type="text"
                  placeholder="e.g. Dilani Perera"
                  value={form.jobOwner}
                  onChange={handleChange('jobOwner')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="assignPerson">Assign Person</label>
                <input
                  id="assignPerson"
                  type="text"
                  placeholder="e.g. Nadeesha Silva"
                  value={form.assignPerson}
                  onChange={handleChange('assignPerson')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange('startDate')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange('dueDate')}
                />
              </div>

              <div className="form-field">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange('endDate')}
                />
              </div>
                  <div className="form-field">
  <label htmlFor="projectCost">Project Cost</label>
  <input
    id="projectCost"
    type="number"
    min="0"
    placeholder="0.00"
    value={form.projectCost}
    onChange={handleChange('projectCost')}
  />
</div>

<div className="form-field">
  <label htmlFor="projectExpenses">Project Expenses</label>
  <input
    id="projectExpenses"
    type="number"
    min="0"
    placeholder="0.00"
    value={form.projectExpenses}
    onChange={handleChange('projectExpenses')}
  />
</div>

<div className="form-field">
  <label>Profit</label>
  <input
    type="text"
    value={
      (Number(form.projectCost || 0) -
      Number(form.projectExpenses || 0)).toFixed(2)
    }
    readOnly
  />
</div>
              <div className="form-field form-field-full">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  rows={3}
                  placeholder="Notes, status updates, or anything the team should know..."
                  value={form.remarks}
                  onChange={handleChange('remarks')}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : viewMode === 'edit' ? 'Save Changes' : 'Add Order'}
              </button>
            </div>
          </form>
        )}

        {isReadOnly && (
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setViewMode('edit');
                if (onModeChange) onModeChange('edit');
              }}
            >
              <Pencil size={15} strokeWidth={2.2} />
              Edit Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ViewField = ({ label, value, mono }) => (
  <div className="view-field">
    <span className="view-label">{label}</span>
    <span className={`view-value ${mono ? 'cell-mono' : ''}`}>{value || '—'}</span>
  </div>
);

export default OrderModal;