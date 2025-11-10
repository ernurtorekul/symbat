import React, { useState, useEffect } from 'react';
import type { Product } from '../types/quiz';
import type { QuizResponse } from '../types/quiz';
import ChatBot from './ChatBot';

interface ProductPageProps {
  quizData?: QuizResponse;
  onViewProductDetail?: (productId: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ quizData, onViewProductDetail }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'personal'>('all');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch both general makeup products and makeup removers
      const [makeupResponse, removerResponse] = await Promise.all([
        fetch('http://localhost:3001/products/search?q=makeup'),
        fetch('http://localhost:3001/products/category/makeup_remover')
      ]);

      let makeupProducts = [];
      let removerProducts = [];

      try {
        makeupProducts = makeupResponse.ok ? await makeupResponse.json() : [];
      } catch (e) {
        console.error('Error parsing makeup response:', e);
        makeupProducts = [];
      }

      try {
        removerProducts = removerResponse.ok ? await removerResponse.json() : [];
      } catch (e) {
        console.error('Error parsing remover response:', e);
        removerProducts = [];
      }

      // Combine products and remove duplicates
      const allProducts = [...makeupProducts, ...removerProducts];
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
      );

      setProducts(uniqueProducts.slice(0, 200)); // Limit to first 200 products
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.productCategory === selectedCategory;
    const matchesBudget = selectedBudget === 'all' || product.budgetRange === selectedBudget;

    // Filter by view mode
    let matchesViewMode = true;
    if (viewMode === 'personal' && quizData?.recommendedProducts) {
      matchesViewMode = quizData.recommendedProducts.some(p => p.id === product.id);
    }

    return matchesSearch && matchesCategory && matchesBudget && matchesViewMode;
  });

  
  
  // Debug log
  if (viewMode === 'personal') {
    console.log('=== PERSONAL RECOMMENDATIONS DEBUG ===');
    console.log('Quiz Data:', quizData);
    console.log('Recommended Products Count:', quizData?.recommendedProducts?.length || 0);
    console.log('Recommended Products:', quizData?.recommendedProducts);
    console.log('All Products Count:', products.length);
    console.log('Filtered Personal Products:', filteredProducts.length);
    console.log('Product IDs being matched:', quizData?.recommendedProducts?.map(p => p.id));
    console.log('All Product IDs:', products.map(p => p.id));
    console.log('Matching products found:', products.filter(p =>
      quizData?.recommendedProducts?.some(rp => rp.id === p.id)
    ));
    console.log('====================================');
  }

  const handleProductClick = (productId: string) => {
    if (onViewProductDetail) {
      onViewProductDetail(productId);
    } else {
      setSelectedProduct(productId);
    }
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const categories = ['all', ...Array.from(new Set([...products.map(p => p.productCategory).filter(Boolean), 'makeup_remover']))];
  const budgetRanges = ['all', 'budget', 'mid', 'premium'];

  // If a product is selected, show product detail
  if (selectedProduct) {
    const ProductDetail = React.lazy(() => import('./ProductDetail'));
    return (
      <React.Suspense fallback={
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      }>
        <ProductDetail productId={selectedProduct} onBack={handleBackToProducts} />
      </React.Suspense>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-gray-600">Explore our curated collection of makeup and skincare products</p>

        {/* View Mode Toggle */}
        {quizData && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setViewMode('personal')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'personal'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Personal Recommendations
              </button>
            </div>
          </div>
        )}

        {quizData && viewMode === 'personal' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Showing products recommended for <span className="font-medium">{quizData.skinType}</span> skin
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => {
                const displayNames: { [key: string]: string } = {
                  'all': 'All Categories',
                  'makeup_remover': 'Makeup Removers',
                  'foundation': 'Foundation',
                  'mascara': 'Mascara',
                  'lipstick': 'Lipstick',
                  'eyeliner': 'Eyeliner',
                  'eyeshadow': 'Eyeshadow',
                  'blush': 'Blush',
                  'bronzer': 'Bronzer',
                  'concealer': 'Concealer',
                  'primer': 'Primer',
                  'highlighter': 'Highlighter',
                  'powder': 'Setting Powder',
                  'skincare': 'Skincare'
                };
                return (
                  <option key={category} value={category}>
                    {displayNames[category] || category?.charAt(0).toUpperCase() + category?.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {budgetRanges.map(range => (
                <option key={range} value={range}>
                  {range === 'all' ? 'All Budgets' : range.charAt(0).toUpperCase() + range.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
              {viewMode === 'personal'
                ? 'No personalized recommendations available. Complete the quiz to get recommendations.'
                : 'No products found matching your criteria.'
              }
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {product.imageUrl && (
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {quizData?.recommendedProducts?.some(p => p.id === product.id) && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Recommended
                      </div>
                    )}
                  </div>
                )}

              <div className="p-6">
                <div className="mb-2">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{product.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.isCrueltyFree && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Cruelty-Free</span>
                  )}
                  {product.isOrganic && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Organic</span>
                  )}
                  {product.isHypoallergenic && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Hypoallergenic</span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                    {product.budgetRange}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {product.price && (
                    <p className="text-lg font-semibold text-green-600">${product.price}</p>
                  )}

                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating ChatBot Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-40 flex items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-medium">Beauty Assistant</span>
      </button>

      {/* ChatBot Modal */}
      {showChatBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <ChatBot
            onClose={() => setShowChatBot(false)}
            products={products}
            userQuizData={quizData}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;