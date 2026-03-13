export type Role = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export type BookingStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  email?: string;
  vehicleInfo?: { type: string; number: string };
}

export interface AddressBookEntry {
  id: string;
  label: string;
  address: string;
}

export interface VehicleType {
  id: string;
  name: string;
  capacityKg: number;
  baseFare: number;
  perKmRate: number;
  enabled: boolean;
}

export interface PricingRule {
  id: string;
  name: string;
  taxPercent: number;
  surgeMultiplier: number;
}

export interface Booking {
  id: string;
  createdAt: number;
  createdBy: string;
  pickup: {
    address: string;
    contactName: string;
    phone: string;
  };
  drop: {
    address: string;
    contactName: string;
    phone: string;
  };
  goods: {
    category: string;
    weightKg: number;
    packages: number;
    fragile: boolean;
    notes?: string;
  };
  vehicle: {
    type: string;
    capacityKg: number;
  };
  pricing: {
    distanceKm: number;
    baseFare: number;
    perKmRate: number;
    tax: number;
    total: number;
  };
  payment: {
    status: PaymentStatus;
    amount: number;
    method: PaymentMethod;
    paidAt?: number;
    paidBy?: string;
    transactionRef?: string;
  };
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    at: number;
    by: string;
  }[];
  assignedDriverId?: string;
  cancelReason?: string;
}
