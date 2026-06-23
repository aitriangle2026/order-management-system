import React from 'react';
import {
  ClipboardList,
  Hourglass,
  Loader,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

const CARD_DEFS = [
  {
    key: 'total',
    label: 'Total Orders',
    icon: ClipboardList,
    accent: 'accent',
    statusValue: null,
    getValue: (s) => s.total,
  },
  {
    key: 'Active',
    label: 'Active`',
    icon: Hourglass,
    accent: 'Active',
    statusValue: 'Active',
    getValue: (s) => s.byStatus?.Active ?? 0,
  },
  
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    accent: 'completed',
    statusValue: 'Completed',
    getValue: (s) => s.byStatus?.Completed ?? 0,
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    accent: 'cancelled',
    statusValue: null,
    getValue: (s) => s.overdue ?? 0,
  },

  {
  key: 'cancelled',
  label: 'Cancelled',
  icon: XCircle,
  accent: 'cancelled',
  statusValue: 'Cancelled',
  getValue: (s) => s.byStatus?.Cancelled ?? 0,
},
];

const SummaryCards = ({ summary, loading, activeStatus, onToggleStatus }) => {
  return (
    <div className="summary-grid">
      {CARD_DEFS.map(({ key, label, icon: Icon, accent, statusValue, getValue }) => {
        const clickable = Boolean(statusValue);
        const isActive = clickable && activeStatus === statusValue;
        return (
          <button
            type="button"
            key={key}
            className={`summary-card ${clickable ? 'summary-card-clickable' : ''} ${isActive ? 'active' : ''}`}
            onClick={clickable ? () => onToggleStatus(statusValue) : undefined}
            disabled={!clickable}
          >
            <div className={`summary-card-icon icon-${accent}`}>
              <Icon size={20} strokeWidth={2.2} />
            </div>
            <div className="summary-card-body">
              <span className="summary-card-value">
                {loading ? '—' : getValue(summary)}
              </span>
              <span className="summary-card-label">{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SummaryCards;