import React from 'react';

// Maps each job status to a CSS class suffix (see index.css for colors)
const STATUS_CLASS_MAP = {
  Pending: 'pending',
  'In Progress': 'progress',
  Completed: 'completed',
  'On Hold': 'hold',
  Cancelled: 'cancelled',
};

const StatusBadge = ({ status }) => {
  const className = STATUS_CLASS_MAP[status] || 'pending';
  return <span className={`status-badge status-${className}`}>{status}</span>;
};

export default StatusBadge;