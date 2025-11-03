import React, { useState, useEffect } from 'react';
import QuizForm from './components/QuizForm';
import QuizResult from './components/QuizResult';
import ProductPage from './components/ProductPage';
import ProductDetail from './components/ProductDetail';
import ProfileDropdown from './components/ProfileDropdown';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import type { QuizResponse } from './types/quiz';
import { quizService } from './services/quizService';
import { authService } from './services/authService';
import type { LoginData } from './services/authService';
import './App.css';

type AppState = 'loading' | 'auth-choice' | 'login' | 'register' | 'quiz' | 'results' | 'dashboard' | 'products' | 'product-detail';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('loading');
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await checkQuizStatus();
        } else {
          // Token was invalid, clear it and show login choice
          authService.logout();
          setCurrentState('auth-choice');
        }
      } else {
        setCurrentState('auth-choice');
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any potentially invalid auth data
      authService.logout();
      setCurrentState('auth-choice');
    }
  };

  const checkQuizStatus = async () => {
    setIsLoading(true);
    try {
      const hasQuiz = await quizService.hasUserCompletedQuiz();
      if (hasQuiz) {
        const userQuiz = await quizService.getUserQuiz();
        setQuizData(userQuiz);
        setCurrentState('results');
      } else {
        setCurrentState('quiz');
      }
    } catch (error) {
      console.error('Error checking quiz status:', error);
      setCurrentState('quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const loginData: LoginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const authResponse = await authService.login(loginData);
      setUser(authResponse.user);
      await checkQuizStatus();
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const registerData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    try {
      const authResponse = await authService.register(registerData);
      setUser(authResponse.user);
      await checkQuizStatus();
    } catch (error) {
      console.error('Registration failed:', error);
      setLoginError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setQuizData(null);
      quizService.clearCachedQuiz();
      setCurrentState('auth-choice');
    }
  };

  const handleQuizComplete = (result: QuizResponse) => {
    setQuizData(result);
    setCurrentState('results');
  };

  const handleRetakeQuiz = () => {
    setQuizData(null);
    quizService.clearCachedQuiz();
    setCurrentState('quiz');
  };

  const handleBrowseProducts = () => {
    setCurrentState('products');
  };

  const handleViewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentState('product-detail');
  };

  const handleBackFromProductDetail = () => {
    setSelectedProductId(null);
    setCurrentState('products');
  };

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Smart Skin Consultant</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                onNavigate={(page) => setCurrentState(page)}
                currentPage={currentState}
                hasQuizData={!!quizData}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderAuthChoice = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Smart Skin Consultant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose an option to get started with your personalized skin quiz
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => setCurrentState('login')}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={() => setCurrentState('register')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Create Account
          </button>
        </div>

        {loginError && (
          <div className="text-center">
            <p className="text-sm text-red-600">
              {loginError}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => setCurrentState('login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center"
          >
            ← Back to options
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                defaultValue="test@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                defaultValue="password123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          {loginError && (
            <div className="text-center">
              <p className="text-sm text-red-600">
                {loginError}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => setCurrentState('login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center"
          >
            ← Back to options
          </button>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to take your personalized skin quiz
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
                defaultValue="Test User"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                defaultValue="test@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Create a password"
                defaultValue="password123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {loginError && (
            <div className="text-center">
              <p className="text-sm text-red-600">
                {loginError}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    if (currentState === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" message="Initializing application..." />
        </div>
      );
    }

    if (currentState === 'auth-choice') {
      return renderAuthChoice();
    }

    if (currentState === 'login') {
      return renderLoginForm();
    }

    if (currentState === 'register') {
      return renderRegisterForm();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <main>
          {currentState === 'quiz' && (
            <QuizForm onQuizComplete={handleQuizComplete} />
          )}
          {currentState === 'results' && quizData && (
            <QuizResult
              quizData={quizData}
              onRetakeQuiz={handleRetakeQuiz}
              onBrowseProducts={handleBrowseProducts}
            />
          )}
          {currentState === 'products' && (
            <ProductPage
              quizData={quizData}
              onViewProductDetail={handleViewProductDetail}
            />
          )}
          {currentState === 'product-detail' && selectedProductId && (
            <ProductDetail
              productId={selectedProductId}
              onBack={handleBackFromProductDetail}
            />
          )}
        </main>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      {renderContent()}
    </ErrorBoundary>
  );
}

export default App;
