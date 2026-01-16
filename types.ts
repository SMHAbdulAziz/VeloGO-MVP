
export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  tripsCount: number;
  memberSince: number;
}

export interface Trip {
  id: string;
  riderId: string;
  driverId?: string;
  pickup: string;
  dropoff: string;
  scheduledTime: string;
  fare: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isGuestTrip: boolean;
  guestPhoto?: string;
  startCode: string;
  guestCode?: string;
  guestsCount: number;
}

export interface FareBreakdown {
  base: number;
  distance: number;
  time: number;
  bonus: number;
  fee: number;
  processing: number;
  surcharges: number;
  total: number;
}
