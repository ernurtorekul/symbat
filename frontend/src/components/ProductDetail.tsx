import React, { useState, useEffect } from 'react';
import type { Product } from '../types/quiz';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="p-8 bg-gray-50">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

              {/* Price */}
              {product.price && (
                <p className="text-3xl font-bold text-green-600 mb-4">${product.price}</p>
              )}

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.isCrueltyFree && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    Cruelty-Free
                  </span>
                )}
                {product.isOrganic && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                    Organic
                  </span>
                )}
                {product.isHypoallergenic && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                    Hypoallergenic
                  </span>
                )}
                {product.isNonComedogenic && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                    Non-Comedogenic
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium capitalize">
                  {product.budgetRange}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <div
                  className="text-gray-700 leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Product Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <dl className="grid grid-cols-1 gap-3">
                {product.productCategory && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="font-medium capitalize">{product.productCategory}</dd>
                  </div>
                )}
                {product.productType && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">Type</dt>
                    <dd className="font-medium capitalize">{product.productType}</dd>
                  </div>
                )}
                {product.apiSource && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">Source</dt>
                    <dd className="font-medium capitalize">{product.apiSource.replace('_', ' ')}</dd>
                  </div>
                )}
                {product.rating && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-600">Rating</dt>
                    <dd className="font-medium">{product.rating}/5</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Suitable Skin Types */}
            {product.suitableSkinTypes && product.suitableSkinTypes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.suitableSkinTypes.map((skinType, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md capitalize"
                    >
                      {skinType} Skin
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <p className="text-gray-700 text-sm">{product.ingredients.join(', ')}</p>
              </div>
            )}

            {/* Tags */}
            {product.tagList && product.tagList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tagList.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {product.productLink && (
                <a
                  href={product.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buy Product
                </a>
              )}
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;