import type { QuizData, QuizResponse } from '../types/quiz';

class QuizService {
  private baseURL = 'http://localhost:3000';

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async submitQuiz(quizData: QuizData): Promise<QuizResponse> {
    try {
      const response = await this.makeRequest('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      // Cache the quiz result locally
      localStorage.setItem('userQuiz', JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async getUserQuiz(userId?: string): Promise<QuizResponse> {
    try {
      const endpoint = userId ? `/quiz/profile/${userId}` : '/quiz/my-profile';
      const response = await this.makeRequest(endpoint);
      const result = await response.json();

      // Cache the quiz result locally
      localStorage.setItem('userQuiz', JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Error getting user quiz:', error);
      throw error;
    }
  }

  async hasUserCompletedQuiz(): Promise<boolean> {
    try {
      // First check if we have a cached result
      const savedQuiz = localStorage.getItem('userQuiz');
      if (savedQuiz) {
        return true;
      }

      // If not, try to fetch from backend
      await this.getUserQuiz();
      return true;
    } catch (error) {
      console.log('User has not completed quiz:', error);
      return false;
    }
  }

  async updateUserQuiz(quizData: QuizData): Promise<QuizResponse> {
    try {
      const response = await this.makeRequest('/quiz/update', {
        method: 'PUT',
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      // Update cached result
      localStorage.setItem('userQuiz', JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  }

  clearCachedQuiz(): void {
    localStorage.removeItem('userQuiz');
  }
}

export const quizService = new QuizService();