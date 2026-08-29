import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Globe,
  Mail,
  MessageSquare,
  PhoneCall,
  HelpCircle,
  FileQuestion,
  Search
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 font-sans border-t border-neutral-800 relative overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Column 1: Brand Info & Status (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                SHOPZONE<span className="text-amber-400">.</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Engineered for everyday luxury and performance. Discover curated apparel, premium tech, and lifestyle essentials with fast global shipping.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All Fulfillment Systems Operational
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all duration-200">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              <a href="#" aria-label="Twitter / X" className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all duration-200">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>

              <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all duration-200">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.808V8z"/></svg>
              </a>

              <a href="#" aria-label="YouTube" className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all duration-200">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>

              <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all duration-200">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {['Electronics & Audio', 'Men\'s Apparel', 'Women\'s Collection', 'Footwear & Sneakers', 'Accessories & Watches', 'Outlet / Flash Deals'].map((item, i) => (
                <li key={i}>
                  <Link to="/products" className="hover:text-amber-300 transition-colors duration-150 inline-block py-0.5">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us (Replaced Support) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  <span>Email Support</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                  <span>24/7 Live Chat</span>
                </Link>
              </li>
              <li>
                <a href="tel:+18005550199" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <PhoneCall className="h-3.5 w-3.5 text-amber-400" />
                  <span>+92 315 0122322</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: FAQs (Replaced Our Company) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">FAQs</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Track Order Status</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                  <span>Returns & Refunds</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors duration-150 flex items-center gap-2 py-0.5">
                  <Truck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Shipping Rates</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Feature Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 my-8 border-y border-neutral-800/80 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Express Global Shipping</p>
              <p className="text-neutral-500 text-[11px]">Tracked delivery to over 120 countries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Encrypted Checkout</p>
              <p className="text-neutral-500 text-[11px]">256-Bit SSL protection guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Hassle-Free Returns</p>
              <p className="text-neutral-500 text-[11px]">30 days full refund policy</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <p>© {new Date().getFullYear()} CRAFT Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-neutral-800">•</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-neutral-300 transition">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-300 transition">Terms of Service</a>
              <a href="#" className="hover:text-neutral-300 transition">Cookie Settings</a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6">
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition text-[11px]">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>USD ($)</span>
              <span className="text-neutral-600">|</span>
              <span>English</span>
            </button>

            <div className="flex items-center gap-2 opacity-75">
              {['VISA', 'MC', 'AMEX', 'PAYPAL', 'APPLE'].map((card) => (
                <span 
                  key={card} 
                  className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono font-bold text-[10px] text-neutral-400 tracking-wider"
                >
                  {card}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;