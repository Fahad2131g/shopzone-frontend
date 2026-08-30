// src/api/productApi.ts
import api from './axiosConfig';

const PRODUCT_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:8083';

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  images: string[];
  sizes: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

// Normalizes backend's `featured`/`newArrival`/`bestSeller` fields back to
// `isFeatured`/`isNewArrival`/`isBestSeller` so the rest of the frontend doesn't need to change
const normalizeProduct = (p: any) => ({
  ...p,
  isFeatured: p.isFeatured ?? p.featured ?? false,
  isNewArrival: p.isNewArrival ?? p.newArrival ?? false,
  isBestSeller: p.isBestSeller ?? p.bestSeller ?? false,
});

// Public Endpoints
export const getAllProductsApi = async () => {
  const response = await api.get(`${PRODUCT_BASE_URL}/api/products/public/all`);
  return (response.data || []).map(normalizeProduct);
};

export const getProductByIdApi = async (id: string) => {
  const response = await api.get(`${PRODUCT_BASE_URL}/api/products/public/${id}`);
  return normalizeProduct(response.data);
};

export const searchProductsApi = async (name: string) => {
  const response = await api.get(`${PRODUCT_BASE_URL}/api/products/public/search?name=${encodeURIComponent(name)}`);
  return (response.data || []).map(normalizeProduct);
};

// Admin Endpoints (CRUD)
export const createProductApi = async (product: ProductPayload) => {
  const cleanedImages = (product.images || []).filter((url) => url.trim() !== '');

  const payload = {
    name: product.name,
    description: product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    category: product.category || 'Fashion',
    images: cleanedImages,
    sizes: product.sizes || [],
    isFeatured: Boolean(product.isFeatured),
    featured: Boolean(product.isFeatured),
    isNewArrival: Boolean(product.isNewArrival),
    newArrival: Boolean(product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    bestSeller: Boolean(product.isBestSeller),
  };

  const response = await api.post(`${PRODUCT_BASE_URL}/api/products`, payload);
  return normalizeProduct(response.data);
};

export const updateProductApi = async (id: string, product: ProductPayload) => {
  const cleanedImages = (product.images || []).filter((url) => url.trim() !== '');

  const payload = {
    name: product.name,
    description: product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    category: product.category || 'Fashion',
    images: cleanedImages,
    sizes: product.sizes || [],
    isFeatured: Boolean(product.isFeatured),
    featured: Boolean(product.isFeatured),
    isNewArrival: Boolean(product.isNewArrival),
    newArrival: Boolean(product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    bestSeller: Boolean(product.isBestSeller),
  };

  const response = await api.put(`${PRODUCT_BASE_URL}/api/products/${id}`, payload);
  return normalizeProduct(response.data);
};

export const deleteProductApi = async (id: string): Promise<void> => {
  await api.delete(`${PRODUCT_BASE_URL}/api/products/${id}`);
};