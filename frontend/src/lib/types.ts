// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Deal types
export interface Deal {
  _id: string;
  title: string;
  description: string;
  provider: string;
  isLocked: boolean;
  isHumanity: boolean;
  termsUrl?: string;
  tags: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealsResponse {
  deals: Deal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Claim types
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'redeemed';

export interface Claim {
  _id: string;
  user: string;
  deal: Deal;
  status: ClaimStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimsResponse {
  claims: Claim[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API error
export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// Form types
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

