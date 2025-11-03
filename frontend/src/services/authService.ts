export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

class AuthService {
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

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      // Store auth data
      localStorage.setItem('user', JSON.stringify(result.user));

      return {
        user: result.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      // Store auth data
      localStorage.setItem('user', JSON.stringify(result.user));

      return {
        user: result.user,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Note: Backend doesn't have a logout endpoint, so we just clear local storage
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return null;
      }

      const response = await this.makeRequest('/users/profile');

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear invalid user data
      localStorage.removeItem('user');
      return null;
    }
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user; // Just check if user data exists
  }

  getStoredUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();
export type { LoginData, RegisterData, AuthResponse };