import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Check, Percent, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { login, type AppDispatch } from '../store/store';
import { googleLoginApi } from '../api/authApi';
import toast from 'react-hot-toast';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Very weak', color: 'bg-rose-400' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-emerald-400' },
    { label: 'Strong', color: 'bg-emerald-600' },
  ];
  return { score, ...levels[score] };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
             const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(login({ email: data.email || email, token: data.token }));
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      toast.error('Server error. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google sign-up failed — no credential returned');
      return;
    }
    setGoogleLoading(true);
    try {
      const data = await googleLoginApi(credentialResponse.credential);
      const token = data.token || data.jwt || data.accessToken;

      if (!token) {
        throw new Error('No authentication token received from backend.');
      }

      dispatch(login({ email: data.email, token }));
      toast.success(`Welcome, ${data.name || data.email}!`);
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Google sign-up failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center bg-[#FAF9F5] px-4 py-12 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-4xl relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl shadow-amber-900/10 border border-amber-200/70 grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xl font-black text-amber-950">
              SHOPZONE <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-amber-950 sm:text-3xl">Create an account</h2>
            <p className="mt-1 text-xs font-medium text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-amber-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mb-4">
            {googleLoading ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-[#FAF8F3] py-3 text-xs font-semibold text-stone-500">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                Signing up with Google...
              </div>
            ) : (
              <div className="flex justify-center [&>div]:!w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google sign-up failed')}
                  shape="pill"
                  width="100%"
                  text="signup_with"
                />
              </div>
            )}
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-amber-200"></div>
            <span className="absolute bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-amber-200 bg-[#FAF8F3] py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-amber-200 bg-[#FAF8F3] py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-amber-200 bg-[#FAF8F3] py-2.5 pl-10 pr-10 text-xs font-medium text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength.score ? strength.color : 'bg-amber-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-stone-500">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border bg-[#FAF8F3] py-2.5 pl-10 pr-10 text-xs font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-1 ${
                    touched && !passwordsMatch
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/40'
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/40'
                  }`}
                />
                {confirmPassword.length > 0 && passwordsMatch && (
                  <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {touched && !passwordsMatch && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-[11px] font-semibold text-rose-500"
                >
                  Passwords don't match
                </motion.p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-950 py-3 text-xs font-bold text-amber-50 shadow-lg shadow-amber-900/10 transition-all hover:bg-amber-900 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-amber-200 border-t-transparent animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-center text-stone-400 leading-relaxed pt-1">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        {/* Right Side: Visual Panel */}
        <div className="hidden lg:relative lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 p-12 text-white overflow-hidden">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <ShieldCheck className="h-4 w-4" /> Member Benefits
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold leading-snug">Join the ShopZone community.</p>
              <p className="text-xs text-amber-100/70 leading-relaxed max-w-xs">
                Create an account and unlock a faster, smarter way to shop.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-amber-300">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-bold">Welcome Offer</span>
              </div>
              <p className="text-lg font-extrabold">$15 off your first order</p>
              <p className="text-[11px] text-amber-100/60">Applied automatically once you sign up</p>
            </motion.div>

            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/70">
              <Percent className="h-3.5 w-3.5" />
              <span>Exclusive member-only discounts, every week</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}