import { useMemo } from 'react';

class ApiClient {
  private readonly url: string;

  private isRefreshing = false;

  constructor(url: string) {
    this.url = url;
  }

  async get(endpoint: string, headers?: Record<string, string>): Promise<Response> {
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, data: T, headers?: Record<string, string>): Promise<Response> {
    return this.request(endpoint, { method: 'POST', headers, body: JSON.stringify(data) });
  }

  private async request(endpoint: string, options: RequestInit): Promise<Response> {
    try {
      const response = await fetch(`${this.url}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        credentials: 'include',
      });

      if (response.status === 401 && !this.isRefreshing) {
        this.isRefreshing = true;

        await this.refreshToken();

        this.isRefreshing = false;

        return this.request(endpoint, options);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async refreshToken(): Promise<Response> {
    const response = await this.post('/refresh', {});

    if (response.status !== 200) {
      throw new Error('Failed to refresh token');
    }

    return response;
  }
}

export const useApiClient = (url: string) => {
  return useMemo(() => new ApiClient(url), [url]);
};

