import React, { useState, useEffect } from 'react';
import { budgetService, analyticsService, forecastService } from '../services/services';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard = ({ budgetId }) => {
  const [metrics, setMetrics] = useState(null);
  const [varianceData, setVarianceData] = useState(null);
  const [quarterlyData, setQuarterlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value || 0);

  useEffect(() => {
    if (!budgetId) {
      setLoading(false);
      setMetrics(null);
      setVarianceData(null);
      setQuarterlyData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, varianceRes, quarterlyRes] = await Promise.all([
          budgetService.getDashboard(budgetId),
          analyticsService.getVarianceAnalysis(budgetId),
          analyticsService.getQuarterlyComparison(budgetId),
        ]);

        setMetrics(dashboardRes.data);
        setVarianceData(varianceRes.data);
        setQuarterlyData(quarterlyRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetId]);

  if (!budgetId) {
    return (
      <section className="animate-fade-in rounded-2xl border border-brand-rust/20 bg-white/85 p-8 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl text-brand-navy">Executive Budget Dashboard</h1>
        <p className="mt-3 max-w-2xl text-brand-navy/80">
          Select a budget in Budget Management to load utilization analytics, variance trends, and forecasting insights.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-brand-rust/20 bg-white/85 p-8 text-center text-brand-navy shadow-xl">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-rust/40 bg-brand-rust/10 p-6 text-brand-navy shadow-lg">
        {error}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="rounded-2xl border border-brand-rust/40 bg-brand-rust/10 p-6 text-brand-navy shadow-lg">
        No data available.
      </div>
    );
  }

  const colors = ['#C45435', '#1E3656', '#D7C29A', '#406290', '#9E3D26'];
  const metricCards = [
    { label: 'Total Budgeted', value: formatCurrency(metrics.totalBudgeted), hint: 'Planned annual allocation' },
    { label: 'Total Spent', value: formatCurrency(metrics.totalSpent), hint: 'Recorded expenses to date' },
    { label: 'Remaining', value: formatCurrency(metrics.totalRemaining), hint: 'Available operating budget' },
    {
      label: 'Utilization Rate',
      value: `${metrics.utilizationPercentage?.toFixed(2) || '0.00'}%`,
      hint: 'Spend ratio against budget',
    },
    { label: 'Cost Per Student', value: formatCurrency(metrics.costPerStudent), hint: 'Efficiency indicator' },
  ];

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-brand-rust/30 bg-gradient-to-r from-brand-navy via-brand-navy to-brand-rust p-6 text-brand-cream shadow-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-sand">Financial Overview</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Executive Budget Dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm md:text-base text-brand-cream/90">
          Monitor budget health, spending velocity, and risk indicators with analytics designed for school finance teams.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((card, index) => (
          <article
            key={card.label}
            className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-lg ring-1 ring-brand-navy/5 backdrop-blur"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-brand-navy/60">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{card.value}</p>
            <p className="mt-2 text-xs text-brand-navy/70">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-xl">
          <h3 className="font-display text-xl text-brand-navy">Total Budget vs Actual Spend</h3>
          <p className="mb-2 text-sm text-brand-navy/70">Snapshot of planned and consumed funds.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Budget', value: metrics.totalBudgeted }, { name: 'Spent', value: metrics.totalSpent }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5C39E" />
              <XAxis dataKey="name" tick={{ fill: '#1E3656' }} />
              <YAxis tick={{ fill: '#1E3656' }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#C45435" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-xl">
          <h3 className="font-display text-xl text-brand-navy">Burn Rate by Line Item</h3>
          <p className="mb-2 text-sm text-brand-navy/70">Identify high-consumption categories quickly.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.burnRatePerItem || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5C39E" />
              <XAxis dataKey="category" angle={-40} textAnchor="end" height={90} tick={{ fill: '#1E3656', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1E3656' }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="spent" fill="#1E3656" name="Spent" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-xl">
          <h3 className="font-display text-xl text-brand-navy">Top 5 Cost Drivers</h3>
          <p className="mb-2 text-sm text-brand-navy/70">Spending concentration by category.</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={metrics.topCostDrivers || []} dataKey="spent" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {(metrics.topCostDrivers || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {quarterlyData && (
          <div className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-xl">
            <h3 className="font-display text-xl text-brand-navy">Quarterly Spend Trend</h3>
            <p className="mb-2 text-sm text-brand-navy/70">Track momentum through the fiscal year.</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Object.entries(quarterlyData).map(([quarter, data]) => ({ quarter, spent: data.spent }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5C39E" />
                <XAxis dataKey="quarter" tick={{ fill: '#1E3656' }} />
                <YAxis tick={{ fill: '#1E3656' }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="spent" stroke="#C45435" strokeWidth={3} dot={{ r: 4, fill: '#1E3656' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {varianceData && (
        <div className="overflow-hidden rounded-2xl border border-brand-rust/20 bg-white/95 shadow-xl">
          <div className="border-b border-brand-rust/20 bg-brand-navy px-5 py-4 text-brand-cream">
            <h2 className="font-display text-2xl">Variance Analysis</h2>
            <p className="mt-1 text-sm text-brand-cream/80">Line-item performance against allocations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-brand-sand/35 text-left text-brand-navy">
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Allocated</th>
                <th className="px-4 py-3 font-semibold">Spent</th>
                <th className="px-4 py-3 font-semibold">Variance</th>
                <th className="px-4 py-3 font-semibold">Variance %</th>
                <th className="px-4 py-3 font-semibold">Utilization %</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {varianceData.lineItemVariance?.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-brand-navy/10 ${
                    item.status === 'Over Budget' ? 'bg-brand-rust/10' : 'bg-brand-cream/60'
                  }`}
                >
                  <td className="px-4 py-3 text-brand-navy">{item.category}</td>
                  <td className="px-4 py-3 text-brand-navy">{formatCurrency(item.allocated)}</td>
                  <td className="px-4 py-3 text-brand-navy">{formatCurrency(item.spent)}</td>
                  <td className="px-4 py-3 text-brand-navy">{formatCurrency(item.variance)}</td>
                  <td className="px-4 py-3 text-brand-navy">{item.variancePercentage?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-brand-navy">{item.utilizationPercentage?.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        item.status === 'Over Budget'
                          ? 'bg-brand-rust text-brand-cream'
                          : 'bg-brand-navy text-brand-cream'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </section>
  );
};
