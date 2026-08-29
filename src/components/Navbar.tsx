import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Heart, User, Search, ChevronDown, LogOut, Menu, X, Flame, Sparkles, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, logout } from '../store/store';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenAuth?: () => void;
  user?: { email: string } | null;
  onLogout?: () => void;
}

const CATEGORIES = [
  { name: 'All Products', slug: '/products' },
  { name: 'Electronics', slug: '/products?category=Electronics' },
  { name: 'Fashion', slug: '/products?category=Fashion' },
  { name: 'Footwear', slug: '/products?category=Footwear' },
  { name: 'Accessories', slug: '/products?category=Accessories' },
  { name: 'Home & Living', slug: '/products?category=Home%20%26%20Living' },
];

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenAuth = () => {},
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isAuthenticated, email } = useSelector((state: RootState) => state.auth);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) {
        onOpenAuth();
      } else {
        navigate('/login');
      }
    } else {
      setUserDropdownOpen((prev) => !prev);
    }
  };

  const handleLogoutClick = () => {
    setUserDropdownOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* ================= LEFT: LOGO + SEARCH ================= */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-neutral-900 shrink-0">
            SHOPZONE <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden sm:relative sm:flex sm:w-52 md:w-64 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-sm font-medium text-neutral-900 outline-none transition-all focus:border-neutral-900 focus:bg-white shadow-sm"
            />
          </form>
        </div>

        {/* ================= MIDDLE: CATEGORIES + HIGHLIGHTS ================= */}
        <nav className="hidden md:flex md:items-center md:gap-1 lg:gap-3">
          <div className="relative group">
            <button className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:text-indigo-600">
              Categories
              <ChevronDown className="h-4 w-4 text-neutral-500 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 group-hover:block">
              <div className="w-60 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.slug}
                    className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-indigo-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/best-sellers"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-indigo-600 hover:bg-neutral-50"
          >
            <Flame className="h-4 w-4 text-amber-500" />
            Best Sellers
          </Link>

          <Link
            to="/new-arrivals"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-indigo-600 hover:bg-neutral-50"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            New Arrivals
          </Link>

          <Link
            to="/deals"
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100"
          >
            <Tag className="h-4 w-4 text-rose-500" />
            Deals
          </Link>
        </nav>

        {/* ================= RIGHT: WISHLIST, CART, PERSON ================= */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-rose-500"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-indigo-600"
            title="Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleUserIconClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-all hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
              title={isAuthenticated ? email || 'Account' : 'Sign In / Register'}
            >
              {isAuthenticated ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-xs shadow-sm">
                  {email ? email[0].toUpperCase() : 'U'}
                </div>
              ) : (
                <User className="h-5.5 w-5.5" />
              )}
            </button>

            {isAuthenticated && userDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl z-50">
                <div className="border-b border-neutral-100 px-3 py-2.5">
                  <p className="text-[10px] uppercase font-semibold text-neutral-400">Signed in as</p>
                  <p className="truncate text-xs font-bold text-neutral-800">{email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE EXPANDED MENU ================= */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white p-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm outline-none"
            />
          </form>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <Link
              to="/best-sellers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1 rounded-xl bg-amber-50 py-2.5 text-xs font-bold text-amber-700"
            >
              <Flame className="h-4 w-4 text-amber-500" /> Best Sellers
            </Link>
            <Link
              to="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700"
            >
              <Sparkles className="h-4 w-4 text-indigo-500" /> New Arrivals
            </Link>
            <Link
              to="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-700"
            >
              <Tag className="h-4 w-4 text-rose-500" /> Deals
            </Link>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1">Categories</p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.slug}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}