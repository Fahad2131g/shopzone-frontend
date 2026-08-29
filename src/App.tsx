import { useEffect, type ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, type RootState, type AppDispatch } from './store/store';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
import DealsPage from './pages/DealsPage';
import { ContactPage } from './pages/ContactPage';

// Admin
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ScrollToTop component ensures navigating to a new page scrolls up to top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Admin Protection Guard
interface AdminRouteProps {
  isAuthenticated: boolean;
  userEmail?: string | null;
  children: ReactNode;
}

function AdminRoute({ isAuthenticated, userEmail, children }: AdminRouteProps) {
  const ADMIN_EMAIL = 'test@gmail.com';

  if (!isAuthenticated || userEmail?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux Auth State
  const { isAuthenticated, email } = useSelector((state: RootState) => state.auth);

  // Redux Cart State
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleOpenAuth = () => {
    navigate('/login');
  };

  const user = isAuthenticated && email ? { email } : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-800">
      <ScrollToTop />
      
      <Navbar
        cartCount={cartCount}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/best-sellers" element={<BestSellersPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Guest Only Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
          />

          {/* User Protected Routes */}
          <Route 
            path="/cart" 
            element={isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />} 
          />
          <Route
            path="/wishlist"
            element={isAuthenticated ? <WishlistPage /> : <Navigate to="/login" replace />}
          />
          <Route 
            path="/orders" 
            element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" replace />} 
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute isAuthenticated={isAuthenticated} userEmail={email}>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;