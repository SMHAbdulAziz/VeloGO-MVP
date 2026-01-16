
import React from 'react';

export const APP_NAME = "VeloGO";
export const VELO_RED = "#D32F2F";
export const VELO_GOLD = "#FFD700";

export const MOCK_RIDER = {
  id: "u1",
  name: "Alex Johnson",
  role: "RIDER",
  avatar: "https://picsum.photos/seed/rider/200",
  rating: 4.9,
  tripsCount: 124,
  memberSince: 2023
};

export const MOCK_DRIVER = {
  id: "d1",
  name: "Marcus Driver",
  role: "DRIVER",
  avatar: "https://picsum.photos/seed/driver/200",
  rating: 4.8,
  tripsCount: 856,
  memberSince: 2022
};

export const MOCK_TRIPS = [
  {
    id: "t1",
    riderId: "u1",
    pickup: "123 Oak St, San Francisco",
    dropoff: "456 Maple Ave, San Francisco",
    scheduledTime: "2025-11-27T14:00:00Z",
    fare: 24.50,
    status: 'PENDING',
    isGuestTrip: false,
    startCode: "42",
    guestsCount: 0
  }
];
