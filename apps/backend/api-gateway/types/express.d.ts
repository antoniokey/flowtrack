declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email?: string;
    };
  }
  interface Response {
    cookie(name: string, value: string, options?: CookieOptions): Response;
  }
  interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean;
    maxAge?: number;
  }
}
