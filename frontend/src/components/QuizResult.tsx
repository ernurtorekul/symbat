import React from 'react';
import type { QuizResponse } from '../types/quiz';

interface QuizResultProps {
  quizData: QuizResponse;
  onRetakeQuiz: () => void;
  onBrowseProducts: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ quizData, onRetakeQuiz, onBrowseProducts }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSkinTypeDescription = (skinType: string) => {
    const descriptions: Record<string, string> = {
      'oily': 'Your skin produces excess sebum, often appearing shiny and being prone to acne.',
      'dry': 'Your skin lacks moisture, often feeling tight, flaky, or rough.',
      'combination': 'Your skin has both oily and dry areas, typically oily in the T-zone.',
      'normal': 'Your skin is well-balanced, not too oily or dry.',
      'sensitive': 'Your skin easily reacts to products and environmental factors.'
    };
    return descriptions[skinType] || '';
  };

  const getSkinToneDescription = (skinTone: string) => {
    const descriptions: Record<string, string> = {
      'very_fair': 'Very fair skin that burns easily and rarely tans.',
      'fair': 'Fair skin that burns easily but can tan gradually.',
      'medium': 'Medium skin that sometimes burns and tans moderately.',
      'olive': 'Olive skin that rarely burns and tans easily.',
      'tan': 'Tan skin that rarely burns and tans very easily.',
      'deep': 'Deep skin that very rarely burns and gets very dark.'
    };
    return descriptions[skinTone] || '';
  };

  const getProductRecommendations = (skinType: string, concerns: string[]) => {
    const recommendations: string[] = [];

    // Based on skin type
    switch (skinType) {
      case 'oily':
        recommendations.push('Oil-free moisturizers', 'Salicylic acid cleansers', 'Mattifying primers');
        break;
      case 'dry':
        recommendations.push('Hydrating serums', 'Cream cleansers', 'Hyaluronic acid products');
        break;
      case 'combination':
        recommendations.push('Balancing toners', 'Lightweight moisturizers', 'Gentle exfoliants');
        break;
      case 'sensitive':
        recommendations.push('Fragrance-free products', 'Calming ingredients', 'Minimal formulas');
        break;
      default:
        recommendations.push('Balanced skincare routine', 'Broad-spectrum sunscreen');
    }

    // Based on concerns
    if (concerns.includes('Acne')) {
      recommendations.push('Benzoyl peroxide treatments', 'Non-comedogenic products');
    }
    if (concerns.includes('Wrinkles') || concerns.includes('Fine lines')) {
      recommendations.push('Retinol products', 'Peptide serums', 'Antioxidant creams');
    }
    if (concerns.includes('Dark spots') || concerns.includes('Uneven skin tone')) {
      recommendations.push('Vitamin C serums', 'Niacinamide products', 'Gentle brighteners');
    }

    return recommendations.slice(0, 6); // Limit to top 6 recommendations
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Skin Profile</h1>
        <p className="text-gray-600">Personalized insights and recommendations for your skin</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Skin Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skin Profile</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Skin Type</h3>
              <p className="text-lg font-medium text-gray-900 capitalize">{quizData.skinType?.replace('_', ' ') || quizData.skinType}</p>
              <p className="text-sm text-gray-600 mt-1">{getSkinTypeDescription(quizData.skinType)}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Skin Tone</h3>
              <p className="text-lg font-medium text-gray-900 capitalize">{quizData.skinTone?.replace('_', ' ') || quizData.skinTone || 'Not specified'}</p>
              <p className="text-sm text-gray-600 mt-1">{quizData.skinTone ? getSkinToneDescription(quizData.skinTone) : 'Skin tone not provided'}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Primary Concerns</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {quizData.skinConcerns.map((concern, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {quizData.allergies && quizData.allergies.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Allergies to Avoid</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {quizData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-xs text-gray-500">
                Profile completed on {formatDate(quizData.completedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Products Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Products</h2>

          {quizData.recommendedProducts && quizData.recommendedProducts.length > 0 ? (
            <div className="space-y-4">
              {quizData.recommendedProducts.slice(0, 6).map((product, index) => (
                <div key={product.id || index} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    {product.price && (
                      <p className="text-sm font-medium text-green-600">${product.price}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.isCrueltyFree && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Cruelty-Free</span>
                      )}
                      {product.isOrganic && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Organic</span>
                      )}
                      {product.budgetRange && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full capitalize">{product.budgetRange}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {getProductRecommendations(quizData.skinType, quizData.skinConcerns).map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Personalized for you:</strong> These recommendations are based on your skin type, concerns, and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetakeQuiz}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Retake Quiz
        </button>
        <button
          onClick={onBrowseProducts}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
        <button
          onClick={onBrowseProducts}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Save Profile & Browse Products
        </button>
      </div>
    </div>
  );
};

export default QuizResult;