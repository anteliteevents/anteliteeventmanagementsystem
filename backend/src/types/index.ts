// TypeScript type definitions for the backend

import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  role: 'admin' | 'exhibitor';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  venue?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Booth {
  id: string;
  eventId: string;
  boothNumber: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  price: number;
  status: 'available' | 'reserved' | 'booked' | 'unavailable';
  locationX?: number;
  locationY?: number;
  width: number;
  height: number;
  description?: string;
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  boothId: string;
  exhibitorId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservedAt: Date;
  expiresAt?: Date;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  reservationId: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: Date;
  issuedAt?: Date;
  paidAt?: Date;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

