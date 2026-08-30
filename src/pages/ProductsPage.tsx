import React, { useState, useEffect } from 'react';
import { Search, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart, toggleWishlist } from '../store/store';
import type { RootState, AppDispatch } from '../store/store';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  images: string[];
  createdBy: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Footwear', 'Home & Living', 'Accessories'];

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

    const API_BASE = `${import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:8083'}/api/products/public`;

  // Read ?category= from URL on load and whenever it changes (e.g. Navbar link clicked)
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      // Match case-insensitively against real category names
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase() === urlCategory.toLowerCase()
      );
      setSelectedCategory(matched || 'All');
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Read ?search= from URL (e.g. from Navbar search bar) on load and whenever it changes
useEffect(() => {
  const urlSearch = searchParams.get('search');
  if (urlSearch) {
    setSearchQuery(urlSearch);
    setSelectedCategory('All');
  }
}, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/all`;

      if (searchQuery.trim()) {
        url = `${API_BASE}/search?name=${encodeURIComponent(searchQuery.trim())}`;
      } else if (selectedCategory !== 'All') {
        url = `${API_BASE}/category/${encodeURIComponent(selectedCategory)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      toast.error(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchProducts();
}, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    // Keep URL in sync when clicking pills directly too
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const buildCartProduct = (p: ProductResponse) => ({
    id: p.id,
    name: p.name,
    category: p.category || 'General',
    price: p.price,
    originalPrice: null,
    rating: 4.9,
    reviews: 0,
    image: p.images?.[0] || p.imageUrl || 'https://placehold.co/300x300?text=No+Image',
  });

  const handleAddToCart = (p: ProductResponse) => {
    dispatch(addToCart(buildCartProduct(p)));
    toast.success(`${p.name} added to cart!`);
  };

  const handleToggleWishlist = (p: ProductResponse) => {
    dispatch(toggleWishlist(buildCartProduct(p)));
    const isNowWishlisted = !wishlistItems.some((item) => item.id === p.id);
    toast.success(isNowWishlisted ? `${p.name} added to wishlist!` : 'Removed from wishlist');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Explore Catalog</h1>
          <p className="text-xs text-neutral-500 font-medium">Discover premium quality products</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-neutral-900 shadow-sm"
          />
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
          <p className="text-sm font-semibold text-neutral-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const mainImg = p.images?.[0] || p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop';
            const isWishlisted = wishlistItems.some((item) => item.id === p.id);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <Link to={`/products/${p.id}`} className="relative aspect-square overflow-hidden bg-neutral-100 block">
                    <img
                      src={mainImg}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-800 border border-neutral-200/50">
                      {p.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleWishlist(p);
                      }}
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition z-10 ${
                        isWishlisted ? 'text-rose-500' : 'text-neutral-600 hover:text-rose-500'
                      }`}
                      title="Toggle wishlist"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-4">
                    <Link to={`/products/${p.id}`}>
                      <h3 className="font-bold text-sm text-neutral-900 truncate hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{p.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between mt-2 gap-2">
                  <span className="text-base font-black text-neutral-900">${p.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex items-center gap-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 hover:bg-indigo-600 transition-colors"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </button>
                    <Link
                      to={`/products/${p.id}`}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors"
                    >
                      View
                    </Link>
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