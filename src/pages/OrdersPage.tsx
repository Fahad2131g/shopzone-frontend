import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface OrderItemResponse {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
               const response = await fetch(`${import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8084'}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        toast.error(err.message || 'Error loading order history');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-neutral-900 mb-2">My Orders</h1>
      <p className="text-xs text-neutral-500 mb-8 font-medium">Track and view your previous purchase history</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
          <Package className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">No orders placed yet</h3>
          <p className="text-xs text-neutral-500 mt-1">Explore our catalog to place your first order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Order #{order.id}</span>
                  <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-neutral-900">${order.totalAmount.toFixed(2)}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      order.status === 'COMPLETED' || order.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.status === 'COMPLETED' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-neutral-800">
                      {item.productName || `Product ID: ${item.productId}`} <span className="text-neutral-400 font-normal">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-neutral-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}