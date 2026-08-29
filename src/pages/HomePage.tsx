import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { getAllProductsApi } from '../api/productApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/store';
import type { AppDispatch } from '../store/store';
import toast from 'react-hot-toast';
import { toggleWishlist } from '../store/store';

import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Percent,
  Headphones,
  Sparkles,
  Flame,
  ShoppingBag,
  Heart,
  Star,
  Quote,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  Send,
  Smartphone,
  QrCode,
  ChevronDown,
  HelpCircle,
  Mail
} from 'lucide-react';


// Reliable SVG URLs via CDN
const BRANDS = [
  { name: 'Apple', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg' },
  { name: 'Nike', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nike.svg' },
  { name: 'Adidas', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adidas.svg' },
  { name: 'Sony', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sony.svg' },
  { name: 'Samsung', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/samsung.svg' },
  { name: 'Puma', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/puma.svg' },
  { name: 'Bose', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bose.svg' },
];

const CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', count: '120+ Products', slug: '/products?category=electronics' },
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80', count: '350+ Products', slug: '/products?category=apparel' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', count: '90+ Products', slug: '/products?category=shoes' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', count: '210+ Products', slug: '/products?category=accessories' },
];

const FEATURED_PRODUCTS = [
  { id: '1', title: 'Wireless Noise-Canceling Headphones', price: 199.99, rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', tag: 'Best Seller' },
  { id: '2', title: 'Minimalist Minimal Desk Watch', price: 149.00, rating: 4.9, reviews: 88, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', tag: 'New Arrival' },
  { id: '3', title: 'Ergonomic Leather Chair', price: 289.50, rating: 4.7, reviews: 205, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1290?w=500&q=80', tag: 'Sale' },
  { id: '4', title: 'Pro Performance Running Shoes', price: 120.00, rating: 4.6, reviews: 67, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', tag: 'Trending' },
];

// Hero Images
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
];

// Typing Sentences
const TYPING_SENTENCES = [
  "for Your Daily Life.",
  "Tailored for Your Style.",
  "Delivered to Your Door."
];

// Testimonials Data
const TESTIMONIAL_SETS = [
  {
    category: "Featured Reviews",
    items: [
      {
        id: 1,
        bg: "bg-purple-700 text-white",
        span: "md:col-span-2",
        quoteBg: "text-purple-600/40",
        name: "Daniel Clifford",
        role: "Verified Buyer • Tech Enthusiast",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        title: '"I received my order in record time, and the build quality exceeded all expectations. Every penny was worth it!"',
        body: '"I was skeptical ordering electronics online after a bad experience elsewhere. But this store delivered original items, sealed in box with 2-year warranty card included."',
        badge: "5.0 Star Rating"
      },
      {
        id: 2,
        bg: "bg-slate-700 text-white",
        span: "",
        name: "Jonathan Walters",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        title: "The support team was super helpful and fast!",
        body: '"Had an issue with my shipping address. Contacted support via live chat and they updated it immediately before dispatch. Smooth experience!"'
      },
      {
        id: 3,
        bg: "bg-white text-slate-900 border border-slate-200/80",
        span: "lg:row-span-2",
        name: "Kira Whittle",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        title: "Such an effortless shopping experience. Highly recommended!",
        body: '"Before finding this shop, I was constantly comparing prices across multiple sites. Now I buy all my lifestyle gear here because the prices are unmatched and packaging is eco-friendly.\n\nThey also offer hassle-free 30-day cash back guarantees which gave me total confidence to try out new items."'
      },
      {
        id: 4,
        bg: "bg-white text-slate-900 border border-slate-200/80",
        span: "",
        name: "Jeanette Harmon",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
        title: "An overall wonderful and rewarding shop.",
        body: '"Great rewards system and fast dispatch! I earned discount points right on my first order."'
      },
      {
        id: 5,
        bg: "bg-slate-900 text-white",
        span: "md:col-span-2",
        name: "Patrick Abrams",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        title: "Awesome quality products with transparent pricing. No hidden fees or surprise taxes at checkout.",
        body: '"The checkout with Redux cart state made everything fast and smooth. Everything arrived wrapped with extreme care. The standard here is clearly above the rest!"'
      }
    ]
  },
  {
    category: "Verified Delivery Stories",
    items: [
      {
        id: 6,
        bg: "bg-indigo-700 text-white",
        span: "md:col-span-2",
        quoteBg: "text-indigo-600/40",
        name: "Sophia Martinez",
        role: "Frequent Shopper",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
        title: '"Next-day shipping was actually next day! Packaging was super secure and eco-friendly."',
        body: '"Ordered headphones on Wednesday afternoon, received them Thursday morning! The unboxing experience felt luxury without paying premium shipping costs."',
        badge: "Fastest Shipping 2026"
      },
      {
        id: 7,
        bg: "bg-slate-800 text-white",
        span: "",
        name: "Marcus Vance",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80",
        title: "Customer service that actually listens.",
        body: '"Exchanged a shoe size with zero hassle. They sent out the new pair even before I mailed back the original item!"'
      },
      {
        id: 8,
        bg: "bg-white text-slate-900 border border-slate-200/80",
        span: "lg:row-span-2",
        name: "Elena Rostova",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        title: "I love the warm aesthetic and smooth UI of this store!",
        body: '"Shopping here feels relaxing compared to cluttered marketplaces. Everything is well organized and product photos accurately match what arrives at your doorstep."'
      },
      {
        id: 9,
        bg: "bg-white text-slate-900 border border-slate-200/80",
        span: "",
        name: "David Kim",
        role: "Tech Enthusiast",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
        title: "Best prices for authentic electronics.",
        body: '"Checked 4 other sites before buying here. Original brand warranty is valid and active."'
      },
      {
        id: 10,
        bg: "bg-purple-900 text-white",
        span: "md:col-span-2",
        name: "Amara Johnson",
        role: "Verified Buyer",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80",
        title: "Returning buyer for 3 years straight. Never disappoints!",
        body: '"From clothing to accessories, everything has held up through daily use. Highly recommend the rewards program too!"'
      }
    ]
  }
];


function BrandTicker() {
  return (
    <section className="bg-gradient-to-r from-amber-50/20 via-amber-100/30 to-amber-50/20 py-8 overflow-hidden relative shadow-inner">
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Trusted by Top Brands Worldwide
        </p>
      </div>

      <div className="flex w-max space-x-16 animate-marquee">
        {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
          <div
            key={`${brand.name}-${idx}`}
            className="flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-7 sm:h-8 w-auto max-w-[90px] object-contain text-neutral-800"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  
  const dispatch = useDispatch<AppDispatch>();

  // 1. First, products state is created here:
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsApi();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch products for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. PASTE THEM HERE (right under products state):
  const displayBestSellers = products.filter((p) => p.isBestSeller);
  const featuredProducts = products.filter((p) => p.isFeatured);

  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.75;
      ref.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  // Hero Image Carousel State
  const [currentHeroImg, setCurrentHeroImg] = useState(0);

  // Typewriter Animation State
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Bento Testimonials State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hero Image Auto-rotate
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(heroInterval);
  }, []);

  // Typewriter Effect Logic
  useEffect(() => {
    const currentFullText = TYPING_SENTENCES[textIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
        if (displayedText.length + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % TYPING_SENTENCES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex]);

  // Bento Slide Transition
  const changeSlide = (newIndex: number) => {
    setIsFading(true);
    setTimeout(() => {
      setActiveSlide(newIndex);
      setIsFading(false);
    }, 250);
  };

  // Bento Auto-rotate
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      changeSlide((activeSlide + 1) % TESTIMONIAL_SETS.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, [activeSlide]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Single shared handler used by BOTH Featured and New Arrivals "Add" buttons
  const handleAddToCart = (prod: Product, mainImg: string) => {
    dispatch(
      addToCart({
        id: prod.id,
        name: prod.name,
        category: prod.category || 'General',
        price: prod.price,
        originalPrice: null,
        rating: 4.9,
        reviews: 0,
        image: mainImg,
      })
    );
    toast.success(`${prod.name} added to cart!`);
  };

  const faqCategories = ['All', 'Shipping', 'Returns', 'Products'];

  const faqs = [
    {
      category: "Shipping",
      q: "How fast is express delivery?",
      a: "Standard shipping takes 2–4 business days. Express next-day delivery is available at checkout for eligible postal codes if ordered before 2 PM local time."
    },
    {
      category: "Returns",
      q: "What is your return & exchange policy?",
      a: "We offer a 30-day hassle-free return policy. If you aren't completely satisfied, return your unopened or gently used items for a full refund or instant store credit."
    },
    {
      category: "Shipping",
      q: "How can I track my order live?",
      a: "Once shipped, you will receive an email and SMS with a live GPS tracking link. You can also monitor delivery status inside your account dashboard in real-time."
    },
    {
      category: "Products",
      q: "Are all items authentic & warrantied?",
      a: "Yes, 100%! Every brand item sold on our platform is direct-from-manufacturer, fully sealed, and backed by a 1 to 2-year warranty card."
    }
  ];

  const filteredFaqs = selectedFaqCategory === 'All' 
    ? faqs 
    : faqs.filter(f => f.category === selectedFaqCategory);

  const displayFeatured = products.filter((p) => p.isFeatured).length > 0 
    ? products.filter((p) => p.isFeatured) 
    : products;

  const displayNewArrivals = products.filter((p) => p.isNewArrival).length > 0 
    ? products.filter((p) => p.isNewArrival) 
    : products;

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans">

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100/60 via-amber-50/70 to-stone-100/80 py-16 lg:py-24 border-b border-amber-100">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-200/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-200/70 px-4 py-1.5 text-xs font-semibold text-amber-900 shadow-sm border border-amber-300/60">
                <Sparkles className="h-4 w-4 text-amber-700" /> New Season Collection 2026
              </span>
              
              <h1 className="text-3xl font-bold sm:text-5xl lg:text-5xl tracking-tight text-neutral-900 leading-[1.25] min-h-[120px] sm:min-h-[135px]">
                Discover Crafted Excellence <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 bg-clip-text text-transparent font-extrabold inline-block">
                  {displayedText}
                </span>
                <span className="animate-pulse text-amber-800 font-normal">|</span>
              </h1>
              
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Explore thousands of premium products across tech, apparel, and lifestyle with guaranteed fast shipping and easy returns.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 active:scale-95"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/deals"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/90 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:bg-white active:scale-95"
                >
                  Explore Deals
                </Link>
              </div>
            </div>

            {/* Right Side Image Carousel */}
            <div className="relative mx-auto lg:ml-auto w-full max-w-lg">
              <div className="relative rounded-3xl bg-white/80 backdrop-blur-md p-3 shadow-2xl border border-amber-100 ring-1 ring-amber-900/5">
                <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-neutral-100">
                  {HERO_IMAGES.map((imgUrl, idx) => (
                    <img
                      key={imgUrl}
                      src={imgUrl}
                      alt={`Featured Collection ${idx + 1}`}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                        idx === currentHeroImg ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    />
                  ))}

                  <div className="absolute bottom-3 right-4 z-20 flex gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full">
                    {HERO_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeroImg(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentHeroImg ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 z-20 rounded-2xl bg-white/95 backdrop-blur-lg p-4 shadow-xl border border-amber-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800/70">Special Offer</p>
                    <p className="text-sm font-extrabold text-neutral-900">Up to 40% OFF</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. TRUST / FEATURES STRIP ================= */}
      <section className="border-b border-neutral-100 bg-neutral-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Free Delivery</h4>
                <p className="text-xs text-neutral-500">Orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Secure Payments</h4>
                <p className="text-xs text-neutral-500">100% Protected</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">30 Days Return</h4>
                <p className="text-xs text-neutral-500">Money back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">24/7 Support</h4>
                <p className="text-xs text-neutral-500">Dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* ================= 3. CATEGORY GRID ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Shop by Category</h2>
            <p className="mt-2 text-sm text-neutral-500">Browse through our most popular product categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.slug}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. INFINITE BRAND TICKER ================= */}
      <BrandTicker />

      {/* ================= 5. FEATURED PRODUCTS SECTION ================= */}
   {/* ================= 1. FEATURED PRODUCTS (HORIZONTAL SCROLL) ================= */}
<section className="bg-neutral-50/70 py-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    {/* Header + Nav Buttons */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Featured Products
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Handpicked items selected for quality and value
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View All Products <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Arrow Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(featuredScrollRef, 'left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
            aria-label="Previous Products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll(featuredScrollRef, 'right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
            aria-label="Next Products"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    {/* Scrollable Container */}
    <div
      ref={featuredScrollRef}
      className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {loading ? (
        <div className="py-8 text-neutral-400 text-sm">Loading featured collection...</div>
      ) : (
        displayFeatured.map((prod) => {
          const mainImg = prod.images?.[0] || (prod as any).imageUrl || 'https://placehold.co/300x300?text=No+Image';
          return (
            <div
              key={prod.id}
              className="group relative flex min-w-[260px] max-w-[280px] sm:min-w-[280px] flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md flex-shrink-0"
            >
              {/* Clickable Image Area */}
              <Link to={`/products/${prod.id}`} className="relative h-56 w-full overflow-hidden rounded-xl bg-neutral-100 block">
                <img
                  src={mainImg}
                  alt={prod.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-neutral-800 shadow-sm">
                  {prod.category || 'Featured'}
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleWishlist({
                      id: prod.id,
                      name: prod.name,
                      category: prod.category || 'General',
                      price: prod.price,
                      originalPrice: null,
                      rating: 4.9,
                      reviews: 0,
                      image: mainImg,
                    }));
                    toast.success(`${prod.name} added to wishlist!`);
                  }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition hover:text-rose-500 z-10"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </Link>

              <div className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-bold text-neutral-800">4.9</span>
                    <span className="text-neutral-400">(42)</span>
                  </div>
                  <Link to={`/products/${prod.id}`}>
                    <h3 className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {prod.name}
                    </h3>
                  </Link>

                  {prod.sizes && prod.sizes.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {prod.sizes.map((s) => (
                        <span key={s} className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-base font-extrabold text-neutral-900">${prod.price?.toFixed(2)}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(prod, mainImg);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600 active:scale-95"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>

  </div>
</section>

{/* ================= BEST SELLERS GRID ================= */}
{displayBestSellers.length > 0 && (
  <section className="bg-neutral-50/70 py-16 border-t border-neutral-100">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" /> Best Sellers
          </h2>
          <p className="mt-2 text-sm text-neutral-500">Our most popular picks, loved by customers</p>
        </div>
        <Link
          to="/best-sellers"
          className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View All Best Sellers <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBestSellers.map((prod) => {
          const mainImg = prod.images?.[0] || (prod as any).imageUrl || 'https://placehold.co/300x300?text=No+Image';
          return (
            <div
              key={prod.id}
              className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <Link to={`/products/${prod.id}`} className="relative h-56 w-full overflow-hidden rounded-xl bg-neutral-100 block">
                <img
                  src={mainImg}
                  alt={prod.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 text-white px-2.5 py-1 text-[10px] font-bold shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Best Seller
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleWishlist({
                      id: prod.id,
                      name: prod.name,
                      category: prod.category || 'General',
                      price: prod.price,
                      originalPrice: null,
                      rating: 4.9,
                      reviews: 0,
                      image: mainImg,
                    }));
                    toast.success(`${prod.name} added to wishlist!`);
                  }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition hover:text-rose-500 z-10"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </Link>

              <div className="flex flex-1 flex-col justify-between pt-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-bold text-neutral-800">4.9</span>
                    <span className="text-neutral-400">(42)</span>
                  </div>
                  <Link to={`/products/${prod.id}`}>
                    <h3 className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-base font-extrabold text-neutral-900">${prod.price?.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(prod, mainImg);
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
    </div>
  </section>
)}

      {/* ================= 6. FULL-WIDTH BLACK PROMO DIVIDER ================= */}
      <section className="relative overflow-hidden bg-neutral-950 py-16 text-white">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-400">
                <Gift className="h-4 w-4" /> Limited Time Exclusive Offer
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Claim Up To <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">35% Instant Discount</span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Use promo code <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">CRAFT2026</span> at checkout. Valid for all new shoppers this week.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products?discount=true"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95"
                >
                  Avail Discount Now <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="h-4 w-4 text-amber-400" /> Ends in 48 hours
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Percent className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Seasonal Savings</h4>
                      <p className="text-xs text-neutral-400">Applied automatically at cart</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                    Active Offer
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>Minimum Spend</span>
                    <span className="font-bold text-white">$50.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>Free Shipping Eligible</span>
                    <span className="font-bold text-emerald-400">Yes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span>Applicable Items</span>
                    <span className="font-bold text-white">All Store Categories</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 7. BENTO GRID TESTIMONIALS ================= */}
      <section className="py-20 bg-stone-100/80 border-t border-neutral-200/60 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
                <Award className="h-3.5 w-3.5 text-amber-700" /> Why Choose Us
              </span>

              <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl tracking-tight">
                Trusted by Over{' '}
                <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent font-extrabold">
                  50,000+
                </span>{' '}
                Happy Shoppers
              </h2>
            </div>

            <div className="mt-6 md:mt-0 flex items-center gap-2">
              <button
                onClick={() => changeSlide(activeSlide === 0 ? TESTIMONIAL_SETS.length - 1 : activeSlide - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 hover:bg-slate-900 hover:text-white transition-all duration-200 active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => changeSlide((activeSlide + 1) % TESTIMONIAL_SETS.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 hover:bg-slate-900 hover:text-white transition-all duration-200 active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {TESTIMONIAL_SETS.map((set, idx) => (
              <button
                key={set.category}
                onClick={() => changeSlide(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  activeSlide === idx
                    ? "bg-amber-900 text-white shadow-md scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {set.category}
              </button>
            ))}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300 ease-in-out ${
            isFading ? 'opacity-0 scale-[0.98] translate-y-2' : 'opacity-100 scale-100 translate-y-0'
          }`}>
            {TESTIMONIAL_SETS[activeSlide].items.map((item) => (
              <div
                key={item.id}
                className={`${item.span} ${item.bg} rounded-2xl p-7 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300`}
              >
                {item.quoteBg && (
                  <Quote className={`absolute right-6 top-4 h-32 w-32 ${item.quoteBg} pointer-events-none transition-transform duration-500 group-hover:scale-110`} />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-10 w-10 rounded-full border-2 border-white/40 object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
                    />
                    <div>
                      <h4 className="text-sm font-bold leading-tight">{item.name}</h4>
                      <p className="text-xs opacity-75">{item.role}</p>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-normal leading-relaxed opacity-90 whitespace-pre-line">
                    {item.body}
                  </p>
                </div>

                {item.badge ? (
                  <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-1 text-amber-300 text-xs font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-2 text-white">{item.badge}</span>
                  </div>
                ) : (
                  <div className="mt-5 pt-3 border-t border-slate-500/20 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-800 h-full transition-all duration-500"
              style={{ width: `${((activeSlide + 1) / TESTIMONIAL_SETS.length) * 100}%` }}
            />
          </div>

        </div>
      </section>

      {/* ================= 8. GLASSMORPHISM "COOL" FAQ SECTION ================= */}
      <section className="relative bg-neutral-900 py-20 text-white overflow-hidden border-t border-neutral-800">
        <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="h-4 w-4" /> Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight leading-tight">
              Everything You Need <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                To Shop With Confidence
              </span>
            </h2>
            
            {/* Category Pill Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFaqCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedFaqCategory === cat
                      ? "bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 scale-105"
                      : "bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-700/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Live Support Box */}
            <div className="lg:col-span-4 bg-neutral-800/50 border border-neutral-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-neutral-950 font-bold shadow-md">
                <Headphones className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Still have questions?</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Can't find the answer you are looking for? Our friendly support team is available 24/7.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/10 hover:bg-amber-400 transition active:scale-95">
                  Chat With Live Support <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Avg. response time: 2 mins
                </div>
              </div>
            </div>

            {/* Right Side: Accordion */}
            <div className="lg:col-span-8 space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-neutral-800/80 border-amber-500/50 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20"
                        : "bg-neutral-800/30 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          isOpen 
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                            : "bg-neutral-700/40 text-neutral-400"
                        }`}>
                          {faq.category}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                          {faq.q}
                        </span>
                      </div>

                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen ? "bg-amber-500 text-neutral-950 rotate-180" : "bg-neutral-700/50 text-neutral-300 group-hover:bg-neutral-700"
                      }`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 border-t border-neutral-700/40 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ================= 9. MOBILE APP PROMO ================= */}
      <section className="bg-stone-100 py-16 border-t border-neutral-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 rounded-3xl p-8 sm:p-12 text-white relative shadow-2xl overflow-hidden">
            
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="h-3.5 w-3.5" /> Shopping App
                </span>
                <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight leading-tight">
                  Shop Faster On The Go
                </h2>
                <p className="text-neutral-300 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Download our mobile app for exclusive app-only drops, instant order tracking, and a seamless one-tap checkout experience.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button className="flex items-center gap-3 bg-white text-neutral-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition shadow-md">
                    <span className="text-lg">🍎</span>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-semibold text-neutral-500 leading-none">Download on</p>
                      <p className="text-xs font-extrabold leading-none mt-0.5">App Store</p>
                    </div>
                  </button>

                  <button className="flex items-center gap-3 bg-white text-neutral-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition shadow-md">
                    <span className="text-lg">🤖</span>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-semibold text-neutral-500 leading-none">GET IT ON</p>
                      <p className="text-xs font-extrabold leading-none mt-0.5">Google Play</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl flex items-center gap-5 max-w-sm">
                  <div className="bg-white p-3 rounded-xl shrink-0 shadow-inner">
                    <QrCode className="h-16 w-16 text-neutral-900" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Scan to Download</p>
                    <p className="text-xs text-neutral-300 mt-1 leading-normal">
                      Point your phone camera here to download instantly on iOS & Android.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 10. NEWSLETTER SECTION ================= */}
      <section className="bg-gradient-to-b from-amber-50/60 to-amber-100/40 py-16 border-t border-amber-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-900 shadow-sm">
            <Mail className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Unlock $15 Off Your First Order
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-md mx-auto">
              Subscribe to get secret sales, VIP product launches, and curated weekly style guides.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-sm max-w-md mx-auto">
              🎉 You're in! Check your inbox for your $15 discount code.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20 shadow-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-neutral-800 transition active:scale-95"
              >
                Subscribe <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-neutral-400">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
