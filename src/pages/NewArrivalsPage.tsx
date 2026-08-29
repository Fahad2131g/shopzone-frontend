import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Loader2, Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { getAllProductsApi } from '../api/productApi';
import { addToCart, toggleWishlist } from '../store/store';
import type { RootState, AppDispatch } from '../store/store';
import type { Product } from '../types';

export default function NewArrivalsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsApi();
        setProducts((data || []).filter((p: Product) => p.isNewArrival));
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
        toast.error('Could not load new arrivals');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (p: Product, mainImg: string) => {
    dispatch(
      addToCart({
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        price: p.price,
        originalPrice: null,
        rating: 4.9,
        reviews: 0,
        image: mainImg,
      })
    );
    toast.success(`${p.name} added to cart!`);
  };

  const handleToggleWishlist = (p: Product, mainImg: string) => {
    dispatch(
      toggleWishlist({
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        price: p.price,
        originalPrice: null,
        rating: 4.9,
        reviews: 0,
        image: mainImg,
      })
    );
    const isNowWishlisted = !wishlistItems.some((item) => item.id === p.id);
    toast.success(isNowWishlisted ? `${p.name} added to wishlist!` : 'Removed from wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">New Arrivals</h1>
          <p className="text-xs text-neutral-500 font-medium">Fresh additions to our catalog</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
          <p className="text-sm font-semibold text-neutral-600">No new arrivals right now — check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const mainImg = p.images?.[0] || (p as any).imageUrl || 'https://placehold.co/300x300?text=No+Image';
            const isWishlisted = wishlistItems.some((item) => item.id === p.id);

            return (
              <div
                key={p.id}
                className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <Link to={`/products/${p.id}`} className="relative h-56 w-full overflow-hidden rounded-xl bg-neutral-100 block">
                  <img
                    src={mainImg}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-neutral-900 text-white px-2.5 py-1 text-[10px] font-bold shadow-sm">
                    New Arrival
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleWishlist(p, mainImg);
                    }}
                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition z-10 ${
                      isWishlisted ? 'text-rose-500' : 'text-neutral-600 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </Link>

                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="font-bold text-neutral-800">4.9</span>
                      <span className="text-neutral-400">(new)</span>
                    </div>
                    <Link to={`/products/${p.id}`}>
                      <h3 className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-base font-extrabold text-neutral-900">${p.price?.toFixed(2)}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(p, mainImg);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600 active:scale-95"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}