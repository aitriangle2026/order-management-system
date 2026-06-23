import React from 'react';
import { ClipboardList, LayoutDashboard, Inbox } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
];

const Sidebar = ({ activeView, onNavigate, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <Inbox size={18} strokeWidth={2.4} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Order Desk</span>
          <span className="sidebar-brand-sub">Job Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`sidebar-nav-item ${activeView === key ? 'active' : ''}`}
            onClick={() => onNavigate(key)}
            type="button"
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
  <div className="sidebar-admin-pill">
    <div className="sidebar-admin-avatar">A</div>
    <div className="sidebar-admin-text">
      <span className="sidebar-admin-name">Admin</span>
      <span className="sidebar-admin-role">Order Manager</span>
    </div>
  </div>

  <button
    className="btn btn-primary logout-btn"
    onClick={onLogout}
  >
    Logout

  </button>
</div>
    </aside>
  );
};

export default Sidebar;