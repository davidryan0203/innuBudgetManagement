import React from 'react';

const workflowSteps = [
  {
    title: 'Create a Budget',
    description:
      'Open Budget Management, enter fiscal year, enrollment, and school details. Admin users can also select department when creating budgets.',
  },
  {
    title: 'Select Your Budget',
    description:
      'Choose a budget card to activate dashboard analytics, transactions, and alerts for that budget.',
  },
  {
    title: 'Add Line Items',
    description:
      'Add categories, descriptions, and allocated amounts to define how the budget is structured.',
  },
  {
    title: 'Record Transactions',
    description:
      'Enter transactions against a line item with amount, date, and optional invoice/vendor details.',
  },
  {
    title: 'Review Dashboard',
    description:
      'Monitor utilization, remaining budget, cost drivers, quarterly trends, and variance by line item.',
  },
  {
    title: 'Check Alerts and Forecasts',
    description:
      'Use alerts and projected overruns to prioritize risk response before end-of-year overspending.',
  },
];

const statusLifecycle = [
  {
    status: 'pending_approval',
    description:
      'Budget is submitted for review and awaiting admin decision before final activation.',
    owner: 'Admin and designated reviewers',
  },
  {
    status: 'approved',
    description:
      'Admin has approved the budget. Budget can be used as the active approved baseline.',
    owner: 'Admin approves via approval action',
  },
  {
    status: 'locked',
    description:
      'Budget is finalized and locked. Line items are locked and no longer editable.',
    owner: 'Admin locks via lock action',
  },
];

export const UsageManual = () => {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-brand-rust/30 bg-gradient-to-r from-brand-navy via-brand-navy to-brand-rust p-6 text-brand-cream shadow-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-sand">Help Center</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Usage Manual</h1>
        <p className="mt-3 max-w-3xl text-sm md:text-base text-brand-cream/90">
          Use this guide to walk users through the full budget process from setup to forecasting.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-navy/60">Roles</p>
          <p className="mt-2 text-brand-navy">`admin` and `department_head`</p>
        </article>
        <article className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-navy/60">Demo Data</p>
          <p className="mt-2 text-brand-navy">Run `npm run seed` before walkthroughs.</p>
        </article>
        <article className="rounded-2xl border border-brand-rust/20 bg-white/90 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-navy/60">Access Rule</p>
          <p className="mt-2 text-brand-navy">Department heads only see budgets in their department.</p>
        </article>
      </div>

      <div className="rounded-2xl border border-brand-rust/20 bg-white/95 p-6 shadow-xl">
        <h2 className="font-display text-2xl text-brand-navy">Core Workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {workflowSteps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-brand-navy/10 bg-brand-cream/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-rust">Step {index + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-brand-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-brand-navy/80">{step.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-rust/20 bg-white/95 p-6 shadow-xl">
        <h2 className="font-display text-2xl text-brand-navy">Budget Status Lifecycle</h2>
        <p className="mt-2 text-sm text-brand-navy/80">
          Budgets move through controlled statuses so approval and closure are auditable.
        </p>
        <div className="mt-4 space-y-3">
          {statusLifecycle.map((item) => (
            <article key={item.status} className="rounded-xl border border-brand-navy/10 bg-brand-cream/70 p-4">
              <h3 className="text-base font-semibold text-brand-navy">{item.status}</h3>
              <p className="mt-1 text-sm text-brand-navy/80">{item.description}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-brand-rust">Managed by: {item.owner}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
