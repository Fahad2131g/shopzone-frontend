// src/admin/AdminOrders.tsx
import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import toast from 'react-hot-toast';
import {
  getAllOrdersApi,
  updateOrderStatusApi,
  deleteOrderApi,
  deleteAllOrdersApi,
  type Order,
} from '../api/orderApi';
import {
  FiRefreshCw,
  FiSearch,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiCalendar,
  FiTrash2,
} from 'react-icons/fi';

const STATUS_FLOW: Order['status'][] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string; icon: ReactElement }> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-stone-100 text-stone-700 border-stone-300',
    icon: <FiClock className="w-3.5 h-3.5" />,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <FiCheckCircle className="w-3.5 h-3.5" />,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: <FiTruck className="w-3.5 h-3.5" />,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <FiCheckCircle className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    icon: <FiXCircle className="w-3.5 h-3.5" />,
  },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Order['status']>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersApi();
      setOrders(
        [...(data || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch {
      toast.error('Could not load orders from server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatusApi(order.id, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      toast.success(`Order #${order.id} marked as ${STATUS_CONFIG[newStatus].label}`);
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!window.confirm(`Delete order #${order.id} permanently? This cannot be undone.`)) return;
    try {
      await deleteOrderApi(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success(`Order #${order.id} deleted`);
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const handleDeleteAllOrders = async () => {
    if (orders.length === 0) return;
    const confirmed = window.confirm(
      `This will permanently delete ALL ${orders.length} orders. This cannot be undone. Are you absolutely sure?`
    );
    if (!confirmed) return;

    try {
      await deleteAllOrdersApi();
      setOrders([]);
      toast.success('All orders deleted');
    } catch {
      toast.error('Failed to delete all orders');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.id).includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status: Order['status']) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Update shipping status and track order progress in real time.
          </p>
        </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={handleDeleteAllOrders}
            disabled={loading || orders.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs shadow-sm disabled:opacity-50"
          >
            <FiTrash2 className="w-3.5 h-3.5" /> Delete All Orders
          </button>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-950 font-bold text-xs shadow-sm"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200/60 pb-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'ALL'
              ? 'bg-amber-950 text-amber-50 shadow-md'
              : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {(Object.keys(STATUS_CONFIG) as Order['status'][]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              statusFilter === status
                ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-md'
                : `${STATUS_CONFIG[status].color} hover:opacity-80`
            }`}
          >
            {STATUS_CONFIG[status].icon}
            {STATUS_CONFIG[status].label} ({countByStatus(status)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-3 text-stone-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by order ID or customer email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-sm">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm bg-white rounded-3xl border border-amber-200/70">
          No orders found{statusFilter !== 'ALL' ? ` with status "${STATUS_CONFIG[statusFilter].label}"` : ''}.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isCancelled = order.status === 'CANCELLED';
            const currentStepIndex = STATUS_FLOW.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-amber-200/70 shadow-sm overflow-hidden"
              >
                {/* Row header */}
                                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-extrabold text-sm shrink-0">
                      #{order.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                        <FiMail className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate">{order.userEmail}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FiPackage className="w-3 h-3" />
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span className="font-extrabold text-amber-950">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border ${STATUS_CONFIG[order.status].color}`}
                    >
                      {STATUS_CONFIG[order.status].icon}
                      {STATUS_CONFIG[order.status].label}
                    </span>

                    {/* Status dropdown */}
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value as Order['status'])
                      }
                      className="text-[11px] sm:text-xs font-bold border border-amber-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FAF8F3] focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 max-w-[110px] sm:max-w-none"
                    >
                      {(Object.keys(STATUS_CONFIG) as Order['status'][]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="p-2 text-stone-500 hover:text-amber-950 rounded-lg hover:bg-amber-50 transition"
                        title="View order details"
                      >
                        {isExpanded ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete order"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-amber-100 bg-[#FAF8F3] p-5 space-y-5">
                    {/* Shipping Tracker */}
                    {!isCancelled ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                          Shipping Progress
                        </p>
                        <div className="flex items-center">
                          {STATUS_FLOW.map((step, idx) => {
                            const reached = idx <= currentStepIndex;
                            const isLast = idx === STATUS_FLOW.length - 1;
                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center gap-1.5">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      reached
                                        ? 'bg-amber-950 border-amber-950 text-amber-50'
                                        : 'bg-white border-stone-300 text-stone-400'
                                    }`}
                                  >
                                    {STATUS_CONFIG[step].icon}
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold ${
                                      reached ? 'text-amber-950' : 'text-stone-400'
                                    }`}
                                  >
                                    {STATUS_CONFIG[step].label}
                                  </span>
                                </div>
                                {!isLast && (
                                  <div
                                    className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${
                                      idx < currentStepIndex ? 'bg-amber-950' : 'bg-stone-200'
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-700 text-sm font-bold">
                        <FiXCircle className="w-4 h-4" /> This order has been cancelled.
                      </div>
                    )}

                    {/* Line items */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Order Items
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-amber-200/60 text-sm"
                          >
                            <div className="min-w-0">
                              <span className="font-semibold text-stone-900 truncate">
                                {item.productName}
                              </span>
                              <span className="text-stone-400 text-xs ml-2">
                                × {item.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-amber-950">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}