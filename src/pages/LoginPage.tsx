// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { login, type RootState, type AppDispatch } from '../store/store';
import { loginApi, googleLoginApi } from '../api/authApi';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  Package,
  Sparkles,
} from 'lucide-react';

const PERKS = [
  { icon: Package, text: 'Real-time order tracking' },
  { icon: Heart, text: 'Save favorites to your wishlist' },
  { icon: Truck, text: 'Faster checkout, every time' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = touched.email && !emailValid ? 'Enter a valid email address' : '';
  const passwordError = touched.password && password.length === 0 ? 'Password is required' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailValid || !password) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      const token = data.token || data.jwt || data.accessToken;

      if (!token) {
        throw new Error('No authentication token received from backend.');
      }

      dispatch(login({ email: data.email || email, token }));
      toast.success(`Welcome back, ${data.name || data.email || email}!`);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login submit error:', err);
      toast.error(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google sign-in failed — no credential returned');
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
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative flex items-center justify-center bg-[#FAF9F5] px-4 py-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl pointer-events-none" />

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
            <h2 className="mt-4 text-2xl font-bold text-amber-950 sm:text-3xl">Welcome back</h2>
            <p className="mt-1 text-xs font-medium text-stone-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-amber-700 hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          <div className="mb-4">
            {googleLoading ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-[#FAF8F3] py-3 text-xs font-semibold text-stone-500">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <div className="flex justify-center [&>div]:!w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google sign-in failed')}
                  shape="pill"
                  width="100%"
                />
              </div>
            )}
          </div>

          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-amber-200"></div>
            <span className="absolute bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="name@example.com"
                  className={`w-full rounded-2xl border bg-[#FAF8F3] py-2.5 pl-10 pr-4 text-xs font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-1 ${
                    emailError
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/40'
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/40'
                  }`}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-[11px] font-semibold text-rose-500"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">Password</label>
                <span className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border bg-[#FAF8F3] py-2.5 pl-10 pr-10 text-xs font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-1 ${
                    passwordError
                      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/40'
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-500/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-[11px] font-semibold text-rose-500"
                >
                  {passwordError}
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Right Side: Visual Panel */}
        <div className="hidden lg:relative lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 p-12 text-white overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <ShieldCheck className="h-4 w-4" /> Secure Access
          </div>

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold leading-snug">Good to see you again.</p>
              <p className="text-xs text-amber-100/70 leading-relaxed max-w-xs">
                Sign in to pick up right where you left off.
              </p>
            </div>

            <div className="space-y-3">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={perk.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 text-xs text-amber-50/90"
                >
                  <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <perk.icon className="h-4 w-4 text-amber-300" />
                  </div>
                  <span>{perk.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-2 text-[11px] text-amber-200/70">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trusted by 50,000+ shoppers</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}