import { Link } from 'react-router-dom';
import { Tag, Mail, ArrowRight } from 'lucide-react';

export default function DealsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center bg-white rounded-3xl border border-amber-200/70 shadow-sm p-10 sm:p-16">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <Tag className="w-9 h-9 text-amber-700" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
          No Deals Available Right Now
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
          We're not running any promotions at the moment, but great discounts are on the way.
          Stay in touch so you don't miss out when they drop.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-amber-950 px-7 py-3 text-sm font-bold text-amber-50 shadow-lg hover:bg-amber-900 transition active:scale-95"
          >
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-7 py-3 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-50 transition active:scale-95"
          >
            <Mail className="w-4 h-4" /> Contact Us
          </Link>
        </div>

        <p className="text-[11px] text-stone-400 mt-8">
          Follow our newsletter on the homepage for early access to future sales.
        </p>
      </div>
    </div>
  );
}