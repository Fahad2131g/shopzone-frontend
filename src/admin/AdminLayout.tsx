import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiUsers, FiTrendingUp, FiArrowLeft, FiShield } from 'react-icons/fi';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: FiTrendingUp },
    { label: 'Products Catalog', path: '/admin/products', icon: FiBox },
    { label: 'Orders & Shipping', path: '/admin/orders', icon: FiShoppingBag },
    { label: 'Users', path: '/admin/users', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF9F5] text-stone-800">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-950 text-amber-50 p-6 flex flex-col justify-between hidden md:flex border-r border-amber-900/40">
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-800/60 text-amber-200 text-[10px] font-bold uppercase tracking-wider mb-2">
              <FiShield className="w-3 h-3" /> Admin Portal
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">E-Commerce HQ</h2>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-amber-950 shadow-md'
                      : 'text-amber-200/80 hover:bg-amber-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-amber-300/80 hover:text-white transition-colors pt-6 border-t border-amber-900/60"
        >
          <FiArrowLeft className="w-4 h-4" /> Return to Storefront
        </Link>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}