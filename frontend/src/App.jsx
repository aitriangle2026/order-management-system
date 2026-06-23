import React, {
  useState
} from 'react';

import Login from './pages/Login';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

function App() {
  const [activeView,
    setActiveView] =
    useState('dashboard');

  const [loggedIn,
    setLoggedIn] =
    useState(
      !!localStorage.getItem('token')
    );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  if (!loggedIn) {

    return (
      <Login
        onLogin={() =>
          setLoggedIn(true)
        }
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Dashboard
          showSummary={
            activeView ===
            'dashboard'
          }
          detailedView={activeView === 'orders'}
        />
      </main>
    </div>
  );
}

export default App;