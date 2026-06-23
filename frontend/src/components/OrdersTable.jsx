import React from 'react';
import { Eye, Trash2, Inbox, Pencil } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, truncate } from '../utils/format';

const OrdersTable = ({
  orders,
  loading,
  onView,
  onEdit,
  onDelete,
  detailedView = false,
}) => {
  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">Loading orders…</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          <Inbox size={28} strokeWidth={1.8} />
          <p>No orders found.</p>
          <span>Try adjusting your search, or add a new order to get started.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table
  className={`orders-table ${
    detailedView ? 'orders-table-full' : 'orders-table-dashboard'
  }`}
>
        <thead>
  <tr>
    <th className="col-jobno">Job No</th>
    <th className="col-jobname">Job Name</th>

    <th className="col-source">Order Source</th>

    
        <th>Job Owner</th>
      

    <th className="col-assign">Assign Person</th>

    {detailedView && (
      <>
        <th>Start Date</th>
      </>
    )}

    <th className="col-date">Due Date</th>
    <th>Status</th>

    {detailedView && (
      <>
        <th>End Date</th>
        <th>Project Cost</th>
        <th>Expenses</th>
        <th>Profit</th>
      </>
    )}

    <th className="col-actions">Actions</th>
  </tr>
</thead>
        <tbody>
  {orders.map((order) => (
    <tr key={order.id}>
      <td>
        <span className="job-chip">{order.jobNo}</span>
      </td>

      <td className="cell-strong">
        {order.jobName}
      </td>

      <td>{order.orderSource || '—'}</td>

      
          <td>{order.jobOwner || '—'}</td>
        

      <td>{order.assignPerson || '—'}</td>

      {detailedView && (
        <>
          <td className="cell-mono">
            {formatDate(order.startDate)}
          </td>
        </>
      )}

      <td className="cell-mono">
        {formatDate(order.dueDate)}
      </td>

      <td>
        <StatusBadge status={order.jobStatus} />
      </td>

      {detailedView && (
        <>
          <td className="cell-mono">
            {formatDate(order.endDate)}
          </td>

          <td>
            Rs. {Number(order.projectCost || 0).toLocaleString()}
          </td>

          <td>
            Rs. {Number(order.projectExpenses || 0).toLocaleString()}
          </td>

          <td
            style={{
              color: order.profit >= 0 ? '#10b981' : '#ef4444',
              fontWeight: 600,
            }}
          >
            Rs. {Number(order.profit || 0).toLocaleString()}
          </td>
        </>
      )}

      <td className="col-actions">
        <div className="row-actions">
          <button
            type="button"
            className="icon-btn"
            title="View order"
            onClick={() => onView(order)}
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className="icon-btn"
            title="Edit order"
            onClick={() => onEdit(order)}
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            className="icon-btn icon-btn-danger"
            title="Delete order"
            onClick={() => onDelete(order)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default OrdersTable;