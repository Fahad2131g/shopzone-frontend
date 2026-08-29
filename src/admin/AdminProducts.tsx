import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';

// 1. Runtime API functions
import { 
  getAllProductsApi, 
  createProductApi, 
  updateProductApi, 
  deleteProductApi 
} from '../api/productApi';

// 2. Type-only imports
import type { ProductPayload } from '../api/productApi';
import type { Product } from '../types';
import { 
  FiPlusCircle, FiTrash2, FiEdit3, FiPackage, FiImage, 
  FiDollarSign, FiFolder, FiCheck, FiSearch, FiX, FiRefreshCw, 
  FiStar, FiZap, FiLayers, FiTrendingUp
} from 'react-icons/fi';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '7', '8', '9', '10', '11'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 4 MAIN TABS
  const [activeTab, setActiveTab] = useState<'ALL' | 'FEATURED' | 'NEW_ARRIVALS' | 'BEST_SELLERS'>('ALL');

  const initialFormState: ProductPayload = {
    name: '',
    description: '',
    price: 0,
    category: 'Fashion',
    stock: 10,
    images: ['', '', '', ''],
    sizes: ['S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  };

  const [formData, setFormData] = useState<ProductPayload>(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const data = await getAllProductsApi();
      setProducts(data || []);
    } catch {
      toast.error('Could not fetch products from database');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'stock' ? (value === '' ? '' : parseFloat(value) || 0) : value,
      }));
    }
  };

  // Safe Image Array Update
  const handleImageChange = (index: number, url: string) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages[index] = url;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // Safe Sizes Toggle
  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes || [];
    const exists = currentSizes.includes(size);
    const updatedSizes = exists
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const handleEditSelect = (product: Product) => {
    setEditingId(product.id);
    
    const rawImages = product.images && product.images.length > 0 
      ? product.images 
      : product.imageUrl ? [product.imageUrl] : [];
    
    const paddedImages = [
      rawImages[0] || '',
      rawImages[1] || '',
      rawImages[2] || '',
      rawImages[3] || '',
    ];

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price ?? 0,
      category: product.category || 'Fashion',
      stock: product.stock ?? 0,
      images: paddedImages,
      sizes: product.sizes || ['S', 'M', 'L'],
      isFeatured: !!product.isFeatured,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
    });

    // Scroll up to the form so the change is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentImages = formData.images || [];
    const validImages = currentImages.filter((img) => img.trim() !== '');

    if (!formData.name || validImages.length === 0 || Number(formData.price) <= 0) {
      toast.error('Please enter a valid product name, price, and at least 1 image URL!');
      return;
    }

    // Sanitize numeric fields to guarantee valid numbers before sending to backend
    const payload: ProductPayload = {
      ...formData,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      images: validImages,
    };

    setSaving(true);

    try {
      if (editingId) {
        await updateProductApi(editingId, payload);
        toast.success('Product updated!');
      } else {
        await createProductApi(payload);
        toast.success('Product created and published!');
      }

      handleCancelEdit();
      fetchProducts();
    } catch {
      toast.error('Server error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductApi(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'FEATURED') return matchesSearch && p.isFeatured;
    if (activeTab === 'NEW_ARRIVALS') return matchesSearch && p.isNewArrival;
    if (activeTab === 'BEST_SELLERS') return matchesSearch && p.isBestSeller;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-950 tracking-tight">Catalog & Homepage Sections</h1>
          <p className="text-stone-500 text-sm mt-1">
            Organize products across Homepage Featured, New Arrivals, Best Sellers, and Category listings.
          </p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={fetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-950 font-bold text-xs shadow-sm"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Refresh Catalog
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 border-b border-amber-200/60 pb-4">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-amber-950 text-amber-50 shadow-md'
              : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <FiLayers className="w-4 h-4" /> All Products & Categories ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('FEATURED')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'FEATURED'
              ? 'bg-amber-500 text-amber-950 shadow-md'
              : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <FiStar className="w-4 h-4" /> Homepage Featured ({products.filter((p) => p.isFeatured).length})
        </button>

        <button
          onClick={() => setActiveTab('NEW_ARRIVALS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'NEW_ARRIVALS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <FiZap className="w-4 h-4" /> Homepage New Arrivals ({products.filter((p) => p.isNewArrival).length})
        </button>

        <button
          onClick={() => setActiveTab('BEST_SELLERS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'BEST_SELLERS'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <FiTrendingUp className="w-4 h-4" /> Best Sellers ({products.filter((p) => p.isBestSeller).length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FORM */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/70 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiPlusCircle className="w-5 h-5 text-amber-900" />
              <h2 className="text-lg font-bold text-amber-950">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-xs font-semibold"
              >
                <FiX className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Product Title *
              </label>
              <div className="relative">
                <FiPackage className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Vintage Leather Jacket"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Price ($) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price ?? ''}
                    onChange={handleInputChange}
                    placeholder="89.99"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Stock Units
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock ?? ''}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Category
              </label>
              <div className="relative">
                <FiFolder className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            {/* UP TO 4 IMAGES WITH TS FALLBACK */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Product Images (Up to 4 URLs) *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[0, 1, 2, 3].map((idx) => {
                  const currentImages = formData.images || [];
                  const imgUrl = currentImages[idx] || '';
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <FiImage className="absolute left-3 top-3 text-stone-400 w-3.5 h-3.5" />
                        <input
                          type="url"
                          placeholder={`Image URL #${idx + 1} ${idx === 0 ? '(Main Thumbnail)' : '(Optional)'}`}
                          value={imgUrl}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF8F3] border border-amber-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt="preview"
                          className="w-8 h-8 rounded-lg object-cover border border-amber-200 bg-stone-100 flex-shrink-0"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SIZES SELECTOR */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = (formData.sizes || []).includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-amber-950 text-amber-50'
                          : 'bg-[#FAF8F3] text-stone-600 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VISIBILITY CHECKBOXES */}
            <div className="p-4 bg-[#FAF8F3] border border-amber-200/80 rounded-2xl space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
                Homepage Visibility
              </span>
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={!!formData.isNewArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                Show in <span className="font-bold text-emerald-800">New Arrivals</span> section
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={!!formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                Show in <span className="font-bold text-amber-900">Featured Products</span> section
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={!!formData.isBestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                Show in <span className="font-bold text-orange-800">Best Sellers</span> section
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Product specs, fit details, materials..."
                className="w-full p-3 bg-[#FAF8F3] border border-amber-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold rounded-xl text-sm transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? 'Publishing...' : <><FiCheck className="w-4 h-4" /> {editingId ? 'Update Product' : 'Save Product'}</>}
            </button>
          </form>
        </div>

        {/* RIGHT LIST */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/70 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-bold text-amber-950">
              {activeTab === 'ALL' && 'All Database Items'}
              {activeTab === 'FEATURED' && 'Featured Homepage Grid Items'}
              {activeTab === 'NEW_ARRIVALS' && 'New Arrivals Grid Items'}
              {activeTab === 'BEST_SELLERS' && 'Best Sellers Grid Items'}
              {' '}({filteredProducts.length})
            </h2>
            <div className="relative w-full sm:w-56">
              <FiSearch className="absolute left-3 top-3 text-stone-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Filter current tab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F3] border border-amber-200/80 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-sm">
              No products found in this section.
            </div>
          ) : (
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const mainImage = p.images?.[0] || p.imageUrl || 'https://placehold.co/150x150?text=No+Image';
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#FAF8F3] border border-amber-200/60 rounded-2xl hover:border-amber-300 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={mainImage}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-xl border border-amber-200 bg-white flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-900 text-sm truncate">{p.name}</h3>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="font-extrabold text-amber-950">
                            ${(p.price ?? 0).toFixed(2)}
                          </span>
                          <span>•</span>
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {p.category}
                          </span>
                          <span>•</span>
                          <span>Stock: {p.stock ?? 0}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
                          <span className="text-stone-500 font-semibold">
                            🖼️ {p.images?.length || 1} Images
                          </span>
                          {p.sizes && p.sizes.length > 0 && (
                            <span className="text-stone-500 font-semibold">
                              📏 Sizes: {p.sizes.join(', ')}
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="bg-amber-500/20 text-amber-950 font-extrabold px-2 py-0.5 rounded">
                              ★ Featured
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="bg-emerald-500/20 text-emerald-900 font-extrabold px-2 py-0.5 rounded">
                              ⚡ New Arrival
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="bg-orange-500/20 text-orange-950 font-extrabold px-2 py-0.5 rounded">
                              🔥 Best Seller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-center">
                      <button
                        onClick={() => handleEditSelect(p)}
                        className="p-2 text-amber-800 hover:text-amber-950 transition rounded-lg hover:bg-amber-100"
                        title="Edit Product"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                        title="Delete Product"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}