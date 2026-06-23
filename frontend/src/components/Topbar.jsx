import React from 'react';
import { Plus, Search } from 'lucide-react';

const Topbar = ({ title, subtitle, search, onSearchChange, onAddOrder }) => {
  return (
    <header className="topbar">
      <div className="topbar-titles">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Search size={16} strokeWidth={2.2} />
          <input
            type="text"
            placeholder="Search by Job No, Job Name, Owner..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="button" onClick={onAddOrder}>
          <Plus size={16} strokeWidth={2.4} />
          New Order
        </button>
      </div>
    </header>
  );
};

export default Topbar;