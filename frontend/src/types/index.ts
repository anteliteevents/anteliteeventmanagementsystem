// TypeScript type definitions for the frontend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  role: 'admin' | 'exhibitor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  boothId: string;
  exhibitorId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservedAt: string;
  expiresAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  booth?: Booth;
}

export interface Transaction {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  reservationId: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: string;
  issuedAt?: string;
  paidAt?: string;
  pdfUrl?: string;
}

export interface FloorPlan {
  id: string;
  eventId: string;
  name: string;
  layoutData: {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    zones?: Array<{
      id: string;
      name: string;
      color: string;
      booths: string[];
    }>;
  };
  imageUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BoothFilters {
  eventId: string;
  size?: Booth['size'];
  minPrice?: number;
  maxPrice?: number;
  status?: Booth['status'];
}

