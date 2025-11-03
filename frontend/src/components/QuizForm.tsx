import React, { useState } from 'react';
import { SkinType, SkinTone } from '../types/quiz';
import type { QuizData, QuizResponse } from '../types/quiz';
import { quizService } from '../services/quizService';

interface QuizFormProps {
  onQuizComplete: (quizData: QuizResponse) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onQuizComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    skinType: SkinType.NORMAL,
    skinTone: SkinTone.MEDIUM,
    skinConcerns: [],
    allergies: [],
  });

  const totalSteps = 5;

  const commonSkinConcerns = [
    'Acne',
    'Wrinkles',
    'Dark spots',
    'Dryness',
    'Oiliness',
    'Redness',
    'Sensitivity',
    'Large pores',
    'Uneven skin tone',
    'Fine lines',
  ];

  const commonAllergies = [
    'Fragrance',
    'Essential oils',
    'Nuts',
    'Latex',
    'Parabens',
    'Sulfates',
    'Gluten',
    'Lanolin',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkinConcernToggle = (concern: string) => {
    setQuizData(prev => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(concern)
        ? prev.skinConcerns.filter(c => c !== concern)
        : [...prev.skinConcerns, concern]
    }));
  };

  const handleAllergyToggle = (allergy: string) => {
    setQuizData(prev => ({
      ...prev,
      allergies: prev.allergies?.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...(prev.allergies || []), allergy]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await quizService.submitQuiz(quizData);
      onQuizComplete(result);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">What's your skin type?</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(SkinType).map(type => (
                <label
                  key={type}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    quizData.skinType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="skinType"
                    value={type}
                    checked={quizData.skinType === type}
                    onChange={(e) => setQuizData(prev => ({ ...prev, skinType: e.target.value as SkinType }))}
                    className="sr-only"
                  />
                  <span className="text-lg font-medium capitalize">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">What's your skin tone?</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(SkinTone).map(tone => (
                <label
                  key={tone}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    quizData.skinTone === tone
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="skinTone"
                    value={tone}
                    checked={quizData.skinTone === tone}
                    onChange={(e) => setQuizData(prev => ({ ...prev, skinTone: e.target.value as SkinTone }))}
                    className="sr-only"
                  />
                  <span className="text-lg font-medium capitalize">{tone.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">What are your main skin concerns?</h2>
            <p className="text-gray-600">Select all that apply (choose at least one)</p>
            <div className="grid grid-cols-1 gap-3">
              {commonSkinConcerns.map(concern => (
                <label
                  key={concern}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    quizData.skinConcerns.includes(concern)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={quizData.skinConcerns.includes(concern)}
                    onChange={() => handleSkinConcernToggle(concern)}
                    className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-lg">{concern}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Do you have any allergies?</h2>
            <p className="text-gray-600">Select all that apply (optional)</p>
            <div className="grid grid-cols-1 gap-3">
              {commonAllergies.map(allergy => (
                <label
                  key={allergy}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    quizData.allergies?.includes(allergy)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={quizData.allergies?.includes(allergy) || false}
                    onChange={() => handleAllergyToggle(allergy)}
                    className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-lg">{allergy}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Review Your Profile</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <span className="font-medium">Skin Type:</span>
                <span className="ml-2 capitalize">{quizData.skinType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Skin Tone:</span>
                <span className="ml-2 capitalize">{quizData.skinTone.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium">Skin Concerns:</span>
                <span className="ml-2">{quizData.skinConcerns.join(', ') || 'None'}</span>
              </div>
              <div>
                <span className="font-medium">Allergies:</span>
                <span className="ml-2">{quizData.allergies?.join(', ') || 'None'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This information will help us provide personalized product recommendations tailored to your skin needs.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || quizData.skinConcerns.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading || quizData.skinConcerns.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Complete Quiz'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !quizData.skinType) ||
              (currentStep === 2 && !quizData.skinTone) ||
              (currentStep === 3 && quizData.skinConcerns.length === 0)
            }
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              (currentStep === 1 && !quizData.skinType) ||
              (currentStep === 2 && !quizData.skinTone) ||
              (currentStep === 3 && quizData.skinConcerns.length === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizForm;