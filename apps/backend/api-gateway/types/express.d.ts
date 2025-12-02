declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email?: string;
    };
    refreshToken?: string;
  }
  interface Response {
    cookie(name: string, value: string, options?: CookieOptions): Response;
    clearCookie(name: string): Response;
    json<T>(data: unknown): T;
  }
  interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    maxAge?: number;
    path?: string;
  }
}
