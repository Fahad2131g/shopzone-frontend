export interface User {
  email: string;
  name: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  images: string[];          // Up to 4 image URLs
  sizes?: string[];          // e.g. ['S', 'M', 'L', 'XL'] or ['8', '9', '10']
  isFeatured?: boolean;      // Shows in Featured Products section on Homepage
  isNewArrival?: boolean;    // Shows in New Arrivals section on Homepage
  isBestSeller?: boolean;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Payment {
  id: number;
  orderId: number;
  userEmail: string;
  amount: number;
  status: string;
  transactionId: string;
}