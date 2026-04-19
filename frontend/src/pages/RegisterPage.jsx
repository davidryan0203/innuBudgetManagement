import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
    role: 'department_head',
    department: '',
  });
  const [error, setError] = useState('');
  const [logoMissing, setLogoMissing] = useState(false);
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (name === 'role' && value === 'admin') {
        nextData.department = '';
      }
      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-cream text-brand-navy">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-brand-rust/20 blur-3xl" />
        <div className="absolute left-[-7rem] top-56 h-64 w-64 rounded-full bg-brand-navy/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-brand-rust/25 bg-white/90 shadow-2xl">
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

            <h2 className="font-display text-3xl text-brand-navy">Register</h2>
            <p className="mt-1 text-sm text-brand-navy/70">Set up your account to start managing budgets.</p>

            {error && <div className="mt-4 rounded-xl border border-brand-rust/40 bg-brand-rust/10 p-3 text-sm text-brand-navy">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-brand-navy">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-brand-navy">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-semibold text-brand-navy">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="school" className="mb-1 block text-sm font-semibold text-brand-navy">School</label>
                <input
                  id="school"
                  name="school"
                  type="text"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={formData.school}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="mb-1 block text-sm font-semibold text-brand-navy">Role</label>
                <select
                  id="role"
                  name="role"
                  className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="department_head">Department Head</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role === 'department_head' && (
                <div>
                  <label htmlFor="department" className="mb-1 block text-sm font-semibold text-brand-navy">Department</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="e.g., IT Department"
                    className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-brand-navy outline-none transition focus:border-brand-rust focus:ring-2 focus:ring-brand-rust/20"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-xl bg-brand-rust px-4 py-3 font-semibold text-brand-cream transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="pt-3 text-center text-sm text-brand-navy/75">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-brand-rust hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
