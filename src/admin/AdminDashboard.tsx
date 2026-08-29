import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProductsApi } from '../api/productApi';
import type { Product } from '../types';
import { FiBox, FiStar, FiZap, FiGrid, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsApi();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load dynamic stats', err);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const newArrivalsCount = products.filter((p) => p.isNewArrival).length;
  const featuredCount = products.filter((p) => p.isFeatured).length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  const stats = [
    { title: 'Total Catalog Products', value: totalProducts, icon: FiBox, color: 'bg-amber-100 text-amber-900' },
    { title: 'Featured Homepage Items', value: featuredCount, icon: FiStar, color: 'bg-amber-500 text-amber-950' },
    { title: 'New Arrival Items', value: newArrivalsCount, icon: FiZap, color: 'bg-emerald-100 text-emerald-800' },
    { title: 'Total Warehouse Stock', value: `${totalStock} Units`, icon: FiGrid, color: 'bg-blue-100 text-blue-800' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-amber-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight">Live Overview</h1>
          <p className="text-stone-500 text-sm mt-1">Real-time stats synced directly with your database.</p>
        </div>
        <button
          onClick={fetchLiveStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-950 hover:bg-amber-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-amber-200/70 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.title}</span>
                <div className="text-2xl font-black text-amber-950 mt-1">{loading ? '...' : stat.value}</div>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-950 text-amber-50 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Manage Homepage Sections & Product Specs</h2>
          <p className="text-amber-200/80 text-xs mt-1">Control which items appear in Featured, New Arrivals, or Category grids, and upload up to 4 images per item.</p>
        </div>
        <Link
          to="/admin/products"
          className="px-5 py-3 bg-amber-400 text-amber-950 font-extrabold rounded-2xl text-sm hover:bg-amber-300 transition flex items-center gap-2"
        >
          Manage Catalog Tabs <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}