import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getProductByIdApi } from '../api/productApi'
import { addToCart, toggleWishlist } from '../store/store'
import type { Product } from '../types'
import type { RootState, AppDispatch } from '../store/store'
import {
  FiShoppingCart,
  FiZap,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiStar,
  FiChevronRight,
  FiHeart,
  FiMinus,
  FiPlus,
  FiCheck,
} from 'react-icons/fi'

const mockReviews = [
  { name: 'Ahmed K.', rating: 5, comment: 'Absolutely love this product! Great quality and fast delivery.', date: '2 days ago' },
  { name: 'Sara M.', rating: 4, comment: 'Very good product. Matches the description perfectly.', date: '1 week ago' },
  { name: 'John D.', rating: 5, comment: 'Excellent quality! Will definitely buy again.', date: '2 weeks ago' },
  { name: 'Fatima R.', rating: 4, comment: 'Good value for money. Happy with my purchase.', date: '3 weeks ago' },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false

  const mockImages = product?.images && product.images.length > 0
  ? product.images
  : [product?.imageUrl || 'https://placehold.co/800x800?text=No+Image']

  useEffect(() => {
    if (id) {
      getProductByIdApi(id)
        .then(data => {
          setProduct(data)
          setLoading(false)
        })
        .catch(() => {
          toast.error('Product not found')
          setLoading(false)
        })
    }
  }, [id])

  const buildCartProduct = () => {
    if (!product) return null
    return {
      id: product.id,
      name: product.name,
      category: product.category || 'General',
      price: product.price,
      originalPrice: null,
      rating: 4.9,
      reviews: 0,
      image: product.images?.[0] || product.imageUrl || 'https://placehold.co/300x300?text=No+Image',
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }
    const cartProduct = buildCartProduct()
    if (!cartProduct) return

    // addToCart increments quantity by 1 per dispatch, so call it once per unit selected
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(cartProduct))
    }
    toast.success(`${quantity}x ${product?.name} added to cart! 🛒`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase')
      navigate('/login')
      return
    }
    handleAddToCart()
    navigate('/cart')
  }

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites')
      navigate('/login')
      return
    }
    const cartProduct = buildCartProduct()
    if (!cartProduct) return

    dispatch(toggleWishlist(cartProduct))
    toast.success(
      isWishlisted ? 'Removed from wishlist' : `${product?.name} added to wishlist!`
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-amber-300 border-t-amber-800"></div>
          <span className="text-xs font-semibold tracking-wider text-amber-900/60 uppercase">Loading details...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center py-16 px-4 text-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-amber-200/50 shadow-xl max-w-md w-full">
          <p className="text-amber-950 font-bold text-xl">Product Not Found</p>
          <p className="text-stone-500 text-sm mt-1">The item you are looking for might have been moved or deleted.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 w-full py-3 bg-stone-900 hover:bg-amber-800 text-amber-50 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. Breadcrumb Navigation */}
        <nav className="text-xs font-medium text-stone-500 mb-8 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-amber-900 transition-colors">Home</button>
          <FiChevronRight className="text-stone-300 h-3 w-3" />
          <button onClick={() => navigate('/products')} className="hover:text-amber-900 transition-colors">Products</button>
          <FiChevronRight className="text-stone-300 h-3 w-3" />
          <span className="text-amber-950 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. Main Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* LEFT: Image Gallery (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {mockImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-amber-50/50 ${
                    selectedImage === i
                      ? 'border-amber-700 shadow-md ring-2 ring-amber-400/20'
                      : 'border-amber-200/60 hover:border-amber-400/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img || product.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 bg-white rounded-3xl overflow-hidden aspect-square border border-amber-200/50 shadow-sm flex items-center justify-center group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={mockImages[selectedImage] || product.imageUrl}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 ${
                  isWishlisted ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-white/90 text-stone-600 hover:text-rose-500'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Badge */}
              <span className="absolute top-4 left-4 bg-amber-100/90 backdrop-blur-md border border-amber-300/60 text-amber-950 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-xs">
                {product.category || 'Featured'}
              </span>
            </div>
          </div>

          {/* RIGHT: Product Information & Purchase Controls (5 Columns) */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-amber-200/60 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4">
                <p className="text-amber-800 font-bold text-xs uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200/80 inline-block mb-3">
                  {product.category}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                  <FiCheck className="w-3.5 h-3.5" /> In Stock ({product.stock})
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <FiStar key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  ))}
                </div>
                <span className="text-stone-800 font-bold text-sm">4.2</span>
                <span className="text-stone-300">|</span>
                <span className="text-amber-800 font-medium text-xs hover:underline cursor-pointer">
                  {mockReviews.length} Verified Customer Reviews
                </span>
              </div>

              {/* Pricing Section */}
              <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-amber-200/50 mb-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-950">${product.price.toFixed(2)}</span>
                    <span className="text-stone-400 line-through text-base font-medium">${(product.price * 1.2).toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">Taxes included. Free shipping eligible.</p>
                </div>
                <span className="bg-amber-200/80 text-amber-950 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                  Save 20%
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Select Quantity
                </label>
                <div className="inline-flex items-center bg-[#FAF8F3] border border-amber-200 rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-white hover:bg-amber-100 text-amber-950 transition-all shadow-xs active:scale-95 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-bold text-amber-950 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 rounded-lg bg-white hover:bg-amber-100 text-amber-950 transition-all shadow-xs active:scale-95 disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-amber-300 hover:bg-amber-400 text-amber-950 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-amber-400/60 shadow-sm transition-all"
                >
                  <FiShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full bg-stone-900 hover:bg-amber-900 text-amber-50 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <FiZap className="w-4 h-4 text-amber-300" /> Buy Now
                </motion.button>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-amber-100 text-center text-[11px] font-medium text-stone-600">
                <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center gap-1">
                  <FiTruck className="text-amber-800 w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center gap-1">
                  <FiRefreshCw className="text-amber-800 w-4 h-4" />
                  <span>30-Day Return</span>
                </div>
                <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center gap-1">
                  <FiShield className="text-amber-800 w-4 h-4" />
                  <span>Secure Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Product Tabs Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-amber-200/60 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-amber-100 mb-8">
            <div className="flex gap-8 overflow-x-auto">
              {['description', 'reviews', 'shipping'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-bold text-sm capitalize transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-amber-950' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab} {tab === 'reviews' && `(${mockReviews.length})`}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-stone-600 text-base leading-relaxed max-w-4xl">{product.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Available Stock', value: `${product.stock} units` },
                  { label: 'Average Rating', value: '4.2 / 5.0' },
                  { label: 'Reviews', value: mockReviews.length.toString() },
                ].map((item, i) => (
                  <div key={i} className="bg-[#FAF8F3] rounded-2xl p-4 border border-amber-200/50">
                    <div className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-extrabold text-amber-950 text-sm sm:text-base">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 p-6 bg-[#FAF8F3] rounded-2xl border border-amber-200/50">
                <div className="text-center sm:text-left sm:pr-8 sm:border-r border-amber-200/80">
                  <div className="text-5xl font-extrabold text-amber-950">4.2</div>
                  <div className="flex text-amber-400 my-2 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-amber-400' : 'text-stone-300'}`} />
                    ))}
                  </div>
                  <div className="text-stone-500 text-xs font-semibold">{mockReviews.length} global ratings</div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3 text-xs font-medium">
                      <span className="text-stone-600 w-10">{star} star</span>
                      <div className="flex-1 bg-amber-100/60 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2.5 rounded-full"
                          style={{ width: star === 5 ? '60%' : star === 4 ? '30%' : '5%' }}
                        ></div>
                      </div>
                      <span className="text-stone-400 w-8 text-right">{star === 5 ? '60%' : star === 4 ? '30%' : '5%'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockReviews.map((review, i) => (
                  <div key={i} className="border border-amber-200/60 rounded-2xl p-5 bg-white shadow-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-amber-200 text-amber-950 rounded-full flex items-center justify-center font-extrabold text-xs">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-amber-950">{review.name}</div>
                        <div className="text-amber-400 text-xs">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <span className="ml-auto text-stone-400 text-[11px]">{review.date}</span>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SHIPPING */}
          {activeTab === 'shipping' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 max-w-3xl">
              {[
                { icon: '🚚', title: 'Standard Delivery', desc: 'Delivered in 5-7 business days — Free on orders over $50', price: '$4.99' },
                { icon: '⚡', title: 'Express Delivery', desc: 'Delivered in 2-3 business days', price: '$9.99' },
                { icon: '🌙', title: 'Overnight Air Priority', desc: 'Next business day guaranteed', price: '$19.99' },
              ].map((opt, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-amber-200/60 bg-[#FAF8F3] rounded-2xl">
                  <span className="text-2xl p-2 bg-white rounded-xl border border-amber-100 shadow-xs">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-amber-950 text-sm">{opt.title}</div>
                    <div className="text-stone-500 text-xs">{opt.desc}</div>
                  </div>
                  <span className="font-extrabold text-amber-900 text-sm">{opt.price}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  )
}