import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { BudgetManagement } from './pages/BudgetManagement';
import { TransactionEntry } from './pages/TransactionEntry';
import { AlertsAndForecasts } from './pages/AlertsAndForecasts';
import { UsageManual } from './pages/UsageManual';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { token, logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'budget', label: 'Budget Management' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'alerts', label: 'Alerts & Forecasts' },
    { id: 'manual', label: 'Usage Manual' },
  ];

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-navy">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-[-5rem] h-72 w-72 rounded-full bg-brand-rust/20 blur-3xl" />
        <div className="absolute left-[-7rem] top-56 h-64 w-64 rounded-full bg-brand-navy/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-brand-rust/20 bg-brand-navy/95 shadow-xl shadow-brand-navy/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Budget Management logo"
              className="h-12 w-12 rounded-full border-2 border-brand-rust object-cover bg-brand-cream"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <p className="font-display text-lg tracking-wide text-brand-sand">Innu Education Budget Intelligence</p>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-cream/80">Budget Management System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-brand-rust text-brand-cream shadow-lg shadow-brand-rust/40'
                    : 'bg-brand-cream/15 text-brand-cream hover:bg-brand-cream/30'
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                {item.label}
              </button>
            ))}

            <button
              className="rounded-full border border-brand-rust bg-brand-rust/20 px-4 py-2 text-sm font-semibold text-brand-sand transition hover:bg-brand-rust hover:text-brand-cream"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        {currentPage === 'dashboard' && <Dashboard budgetId={selectedBudgetId} />}
        {currentPage === 'budget' && (
          <BudgetManagement onBudgetSelect={setSelectedBudgetId} selectedBudgetId={selectedBudgetId} />
        )}
        {currentPage === 'transactions' && selectedBudgetId && (
          <TransactionEntry budgetId={selectedBudgetId} />
        )}
        {currentPage === 'transactions' && !selectedBudgetId && (
          <div className="rounded-2xl border border-brand-rust/30 bg-brand-cream/90 p-8 text-center text-brand-navy shadow-lg">
            Please select a budget first from Budget Management.
          </div>
        )}
        {currentPage === 'alerts' && selectedBudgetId && (
          <AlertsAndForecasts budgetId={selectedBudgetId} />
        )}
        {currentPage === 'alerts' && !selectedBudgetId && (
          <div className="rounded-2xl border border-brand-rust/30 bg-brand-cream/90 p-8 text-center text-brand-navy shadow-lg">
            Please select a budget first from Budget Management.
          </div>
        )}
        {currentPage === 'manual' && <UsageManual />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
