import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { removeFromWishlist, addToCart } from '../store/store';
import type { RootState, AppDispatch } from '../store/store';
import { FiHeart, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const { items } = useSelector((state: RootState) => state.wishlist);
  const dispatch = useDispatch<AppDispatch>();

  const handleMoveToCart = (item: (typeof items)[number]) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
    toast.success(`${item.name} moved to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight flex items-center gap-3">
            <FiHeart className="w-7 h-7" />
            Your Wishlist
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {items.length === 0
              ? 'No favorites saved yet'
              : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-amber-200/70 shadow-sm"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-5">
              <FiHeart className="w-9 h-9 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-amber-950">Your wishlist is empty</h3>
            <p className="text-stone-500 text-sm mt-1.5 mb-6">
              Tap the heart icon on any product to save it here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-amber-950 px-7 py-3 text-sm font-bold text-amber-50 shadow-lg hover:bg-amber-900 transition active:scale-95"
            >
              Browse Products <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl border border-amber-200/70 shadow-sm overflow-hidden group"
                >
                  <Link to={`/products/${item.id}`} className="relative h-52 w-full block overflow-hidden bg-amber-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(removeFromWishlist(item.id));
                        toast.success('Removed from wishlist');
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm hover:bg-white transition"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-neutral-800 shadow-sm">
                        {item.category}
                      </span>
                    )}
                  </Link>

                  <div className="p-4">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-bold text-stone-900 text-sm line-clamp-2 hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-stone-400 line-through mr-1.5">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-base font-extrabold text-amber-950">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-50 py-2.5 text-xs font-bold transition active:scale-95"
                    >
                      <FiShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
