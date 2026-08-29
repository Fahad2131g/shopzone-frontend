import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ==========================================
// TYPES
// ==========================================

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

// ==========================================
// DUMMY PRODUCTS DATA
// ==========================================

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Acoustic Noise-Canceling Headphones',
    category: 'Audio',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    badge: 'Best Seller',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Minimalist Leather Chronograph Watch',
    category: 'Accessories',
    price: 185,
    originalPrice: 220,
    rating: 4.8,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    badge: 'Sale',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Ergonomic Custom Mechanical Keyboard',
    category: 'Workspace',
    price: 140,
    originalPrice: null,
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Premium Waterproof Urban Daypack',
    category: 'Travel',
    price: 120,
    originalPrice: 150,
    rating: 4.9,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Ultra-Sleek Aluminum Laptop Stand',
    category: 'Workspace',
    price: 65,
    originalPrice: null,
    rating: 5.0,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    badge: 'New',
    isNewArrival: true,
  },
  {
    id: '6',
    name: 'Matte Black Stainless Insulated Bottle',
    category: 'Lifestyle',
    price: 42,
    originalPrice: 50,
    rating: 4.8,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    badge: 'New',
    isNewArrival: true,
  },
  {
    id: '7',
    name: 'Ambient Warm-LED Architect Desk Lamp',
    category: 'Workspace',
    price: 89,
    originalPrice: 110,
    rating: 4.9,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    badge: 'New',
    isNewArrival: true,
  },
  {
    id: '8',
    name: 'Fast Magnetic Wireless Charging Dock',
    category: 'Tech Accessories',
    price: 49,
    originalPrice: null,
    rating: 4.7,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1622445268465-843d1838f714?w=600&q=80',
    badge: 'New',
    isNewArrival: true,
  },
];

// ==========================================
// PER-USER STORAGE HELPERS
// ==========================================
// Cart/wishlist are scoped to the currently logged-in email (falls back to a
// shared "guest" bucket if nobody's logged in), so different accounts on the
// same browser never see each other's cart/wishlist contents.

const getCurrentUserKey = (): string => {
  const email = localStorage.getItem('userEmail');
  return email ? email.toLowerCase() : 'guest';
};

const getCartStorageKey = () => `cartItems_${getCurrentUserKey()}`;
const getWishlistStorageKey = () => `wishlistItems_${getCurrentUserKey()}`;

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(getCartStorageKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
};

const loadWishlistFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(getWishlistStorageKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: Product[]) => {
  localStorage.setItem(getWishlistStorageKey(), JSON.stringify(items));
};

// ==========================================
// SLICES
// ==========================================

// 1. Auth Slice
const initialAuthState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('token')),
  email: localStorage.getItem('userEmail') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userEmail', action.payload.email);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
  },
});

// 2. Products Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: initialProducts },
  reducers: {},
});

// 3. Cart Slice (persisted to localStorage, scoped per logged-in user)
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCartFromStorage() },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    toggleCart: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    // Reload the correct user's cart the moment login/logout happens,
    // since authSlice's reducer (which updates localStorage's userEmail)
    // runs first in the same dispatch cycle — see reducer order below.
    builder
      .addCase(authSlice.actions.login, (state) => {
        state.items = loadCartFromStorage();
      })
      .addCase(authSlice.actions.logout, (state) => {
        state.items = loadCartFromStorage();
      });
  },
});

// 4. Wishlist Slice (persisted to localStorage, scoped per logged-in user)
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlistFromStorage() },
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authSlice.actions.login, (state) => {
        state.items = loadWishlistFromStorage();
      })
      .addCase(authSlice.actions.logout, (state) => {
        state.items = loadWishlistFromStorage();
      });
  },
});

// ==========================================
// ACTIONS & STORE CONFIGURATION
// ==========================================

export const { login, logout } = authSlice.actions;
export const { addToCart, removeFromCart, toggleCart, clearCart } = cartSlice.actions;
export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const store = configureStore({
  reducer: {
    // IMPORTANT: `auth` must stay listed before `cart`/`wishlist` here.
    // On every dispatch, each slice reducer below runs in this object's key
    // order. authSlice's login/logout reducers synchronously update
    // localStorage's `userEmail` — cart/wishlist's extraReducers (for the
    // SAME action) then read that already-updated value to load the right
    // user's data. If this order changes, cart/wishlist would read the
    // OLD userEmail and load the wrong user's items.
    auth: authSlice.reducer,
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;