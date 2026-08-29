import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { removeFromCart, clearCart, addToCart } from '../store/store';
import type { CartItem } from '../store/store';
import { createOrderApi } from '../api/orderApi';
import { processPaymentApi } from '../api/paymentApi';
import type { RootState, AppDispatch } from '../store/store';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiTag,
  FiArrowRight,
  FiPackage,
} from 'react-icons/fi';

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 8.99;

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const incrementQty = (item: CartItem) => {
    dispatch(addToCart(item));
  };

  const decrementQty = (item: CartItem) => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart(item.id));
      toast.success('Item removed');
      return;
    }
    dispatch(removeFromCart(item.id));
    for (let i = 0; i < item.quantity - 1; i++) {
      dispatch(addToCart(item));
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    try {
      setLoading(true);
      const orderItems = items.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      const order = await createOrderApi(orderItems);
      toast.success('Order placed! Processing payment...');
      await processPaymentApi(order.id, order.totalAmount);
      toast.success('Payment successful! 🎉');
      dispatch(clearCart());
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight flex items-center gap-3">
            <FiShoppingBag className="w-7 h-7" />
            Your Cart
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {items.length === 0
              ? 'Your cart is currently empty'
              : `${items.length} item${items.length !== 1 ? 's' : ''} ready for checkout`}
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-amber-200/70 shadow-sm"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-5">
              <FiShoppingBag className="w-9 h-9 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-amber-950">Your cart is empty</h3>
            <p className="text-stone-500 text-sm mt-1.5 mb-6">
              Looks like you haven't added anything yet. Let's fix that.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-amber-950 px-7 py-3 text-sm font-bold text-amber-50 shadow-lg hover:bg-amber-900 transition active:scale-95"
              >
                Continue Shopping <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-7 py-3 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-50 transition active:scale-95"
              >
                <FiPackage className="w-4 h-4" /> View My Orders
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              {amountToFreeShipping > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                  <FiTruck className="w-5 h-5 text-amber-700 shrink-0" />
                  <p className="text-xs font-semibold text-amber-900">
                    Add <span className="font-extrabold">${amountToFreeShipping.toFixed(2)}</span> more to
                    unlock <span className="font-extrabold">FREE shipping</span>
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <FiTruck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <p className="text-xs font-bold text-emerald-800">
                    🎉 You've unlocked FREE shipping on this order!
                  </p>
                </div>
              )}

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="bg-white rounded-2xl border border-amber-200/70 shadow-sm p-4 sm:p-5 flex gap-4"
                  >
                    <Link
                      to={`/products/${item.id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-amber-50 border border-amber-100 shrink-0"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/products/${item.id}`}>
                            <h3 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-2 hover:text-amber-800 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          {item.category && (
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            dispatch(removeFromCart(item.id));
                            toast.success('Item removed');
                          }}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                          title="Remove item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-[#FAF8F3] border border-amber-200 rounded-xl p-1">
                          <button
                            onClick={() => decrementQty(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-amber-900 hover:bg-amber-100 transition"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => incrementQty(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-amber-900 hover:bg-amber-100 transition"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-stone-400 line-through mr-2">
                              ${(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                          <span className="text-base font-extrabold text-amber-950">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-center gap-4 mt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-950 transition"
                >
                  ← Continue Shopping
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-950 transition"
                >
                  <FiPackage className="w-4 h-4" /> View My Orders
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-amber-200/70 shadow-sm p-6 sticky top-6 space-y-5">
                <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" /> Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <FiTruck className="w-3.5 h-3.5" /> Shipping
                    </span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-stone-900'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-amber-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-amber-950">Total</span>
                  <span className="text-2xl font-extrabold text-amber-950">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold rounded-xl text-sm transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : (<><span>Checkout & Pay</span> <FiArrowRight className="w-4 h-4" /></>)}
                </button>

                <Link
                  to="/orders"
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-200 rounded-xl text-xs font-bold text-amber-950 hover:bg-amber-50 transition"
                >
                  <FiPackage className="w-3.5 h-3.5" /> View My Orders
                </Link>

                <div className="pt-2 space-y-2.5 border-t border-amber-100">
                  <div className="flex items-center gap-2.5 text-xs text-stone-500">
                    <FiShield className="w-4 h-4 text-emerald-600" />
                    <span>Secure checkout & buyer protection</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-stone-500">
                    <FiTruck className="w-4 h-4 text-amber-700" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-stone-500">
                    <FiTag className="w-4 h-4 text-amber-700" />
                    <span>Best price guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}