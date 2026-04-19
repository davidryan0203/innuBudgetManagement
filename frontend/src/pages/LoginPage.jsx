import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoMissing, setLogoMissing] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-cream text-brand-navy">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-brand-rust/20 blur-3xl" />
        <div className="absolute left-[-7rem] top-56 h-64 w-64 rounded-full bg-brand-navy/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-brand-rust/25 bg-white/90 shadow-2xl">
          <section className="p-7 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              {!logoMissing ? (
                <img
                  src="/logo.png"
                  alt="Innu Budget logo"
                  className="h-12 w-12 rounded-full border border-brand-rust object-cover"
                  onError={() => setLogoMissing(true)}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-rust bg-brand-cream text-base font-display text-brand-navy">
                  IB
                </div>
              )}
              <div>
                <p className="font-display text-lg text-brand-navy">Innu Education Budget Intelligence</p>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-navy/65">Budget Management System</p>
              </div>
            </div>

            <h2 className="font-display text-3xl text-brand-navy">Welcome Back</h2>
            <p className="mt-1 text-sm text-brand-navy/70">Sign in to continue to your dashboard.</p>

            {error && <div className="mt-4 rounded-xl border border-brand-rust/40 bg-brand-rust/10 p-3 text-sm text-brand-navy">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-brand-navy">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-semibold text-brand-navy">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-brand-rust px-4 py-3 font-semibold text-brand-cream transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="pt-1 text-center text-sm text-brand-navy/75">
                Do not have an account?{' '}
                <Link to="/register" className="font-semibold text-brand-rust hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
