// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// Seed data used by the frontend until the backend endpoints are fully wired.
// Shapes intentionally mirror the backend DTOs so swapping to live API calls
// is a drop-in replacement.

import { DEF_CONFIG } from "./sports";

export const EQUIPMENT_CATALOG = [
  { id: "EQ01", name: "Badminton Racket", sportId: 1, icon: "🏸", pricePerHour: 50, deposit: 200, stock: 12, available: 8, condition: "Good", img: "🏸" },
  { id: "EQ02", name: "Shuttlecocks (6 pcs)", sportId: 1, icon: "🏸", pricePerHour: 30, deposit: 0, stock: 40, available: 35, condition: "New", img: "🪶" },
  { id: "EQ03", name: "Football", sportId: 2, icon: "⚽", pricePerHour: 80, deposit: 300, stock: 6, available: 4, condition: "Good", img: "⚽" },
  { id: "EQ04", name: "Football Shin Guards", sportId: 2, icon: "⚽", pricePerHour: 20, deposit: 100, stock: 20, available: 16, condition: "Good", img: "🦺" },
  { id: "EQ05", name: "Cricket Bat", sportId: 3, icon: "🏏", pricePerHour: 100, deposit: 500, stock: 8, available: 5, condition: "Good", img: "🏏" },
  { id: "EQ06", name: "Cricket Helmet", sportId: 3, icon: "🏏", pricePerHour: 40, deposit: 200, stock: 8, available: 6, condition: "Sanitized", img: "⛑️" },
  { id: "EQ07", name: "Cricket Pads (pair)", sportId: 3, icon: "🏏", pricePerHour: 60, deposit: 300, stock: 6, available: 3, condition: "Good", img: "🦵" },
  { id: "EQ08", name: "TT Paddle", sportId: 4, icon: "🏓", pricePerHour: 30, deposit: 150, stock: 16, available: 12, condition: "Good", img: "🏓" },
  { id: "EQ09", name: "TT Ball Set (3 pcs)", sportId: 4, icon: "🏓", pricePerHour: 15, deposit: 0, stock: 30, available: 24, condition: "New", img: "⚪" },
  { id: "EQ10", name: "Bowling Shoes", sportId: 5, icon: "🎳", pricePerHour: 40, deposit: 200, stock: 20, available: 14, condition: "Sanitized", img: "👟" },
  { id: "EQ11", name: "Pickleball Paddle", sportId: 6, icon: "🎾", pricePerHour: 60, deposit: 250, stock: 10, available: 7, condition: "Good", img: "🎾" },
];

export const RENTAL_ORDERS = [
  { id: "RN-101", user: "Rahul Sharma", items: ["Badminton Racket x2", "Shuttlecocks x1"], slot: "Jun 10 · 07:00-08:00", status: "active", total: 130, deposit: 400 },
  { id: "RN-102", user: "Priya Patel", items: ["TT Paddle x2", "TT Balls x1"], slot: "Jun 10 · 09:00-10:00", status: "returned", total: 75, deposit: 0 },
  { id: "RN-103", user: "Arjun Mehta", items: ["Football x1", "Shin Guards x2"], slot: "Jun 10 · 18:00-19:00", status: "pending", total: 120, deposit: 500 },
  { id: "RN-104", user: "Sneha Joshi", items: ["Cricket Bat x1", "Helmet x1", "Pads x1"], slot: "Jun 11 · 06:00-07:00", status: "active", total: 200, deposit: 1000 },
];

export const INIT_CLUBS = [
  {
    id: 1, name: "Parag Sports Arena", location: "Baner, Pune", rating: 4.7, reviews: 312,
    price: 350, distance: "1.2 km", managerId: 2,
    courts: [
      { id: 101, name: "Badminton Court 1", sportId: 1, config: { ...DEF_CONFIG } },
      { id: 102, name: "Badminton Court 2", sportId: 1, config: { ...DEF_CONFIG, bufferTime: 10 } },
      { id: 103, name: "TT Table 1", sportId: 4, config: { ...DEF_CONFIG, openTime: "08:00", slotDuration: 45 } },
      { id: 104, name: "Football Turf A", sportId: 2, config: { ...DEF_CONFIG, openTime: "05:00", closeTime: "23:00", bufferTime: 15, active: false } },
    ],
    equipment: [0, 1, 7, 8],
  },
  {
    id: 2, name: "MVP Sports Complex", location: "Viman Nagar, Pune", rating: 4.5, reviews: 189,
    price: 280, distance: "2.8 km", managerId: null,
    courts: [
      { id: 201, name: "Cricket Net 1", sportId: 3, config: { ...DEF_CONFIG } },
      { id: 202, name: "Bowling Lane 1", sportId: 5, config: { ...DEF_CONFIG, slotDuration: 45 } },
    ],
    equipment: [4, 5, 6, 9],
  },
  {
    id: 3, name: "Elite Play Zone", location: "Koregaon Park, Pune", rating: 4.9, reviews: 521,
    price: 500, distance: "4.1 km", managerId: 3,
    courts: [
      { id: 301, name: "Pickleball Court 1", sportId: 6, config: { ...DEF_CONFIG, slotDuration: 45 } },
    ],
    equipment: [10],
  },
];

export const MANAGERS_POOL = [
  { id: 2, name: "Suresh Patil", email: "suresh@parag.com", phone: "9876543210" },
  { id: 3, name: "Deepa Nair", email: "deepa@elite.com", phone: "9823456789" },
  { id: 4, name: "Ankit Rao", email: "ankit@sports.com", phone: "9812345678" },
];

// Static slot status map for the demo slot grid.
export const SLOT_MAP = {
  "06:00": "available", "07:00": "booked", "08:00": "booked", "09:00": "available",
  "10:00": "available", "11:00": "locked", "12:00": "available", "13:00": "booked",
  "14:00": "available", "15:00": "available", "16:00": "booked", "17:00": "booked",
  "18:00": "available", "19:00": "available", "20:00": "locked", "21:00": "available",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DATES = [9, 10, 11, 12, 13, 14, 15];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const REVENUE_DATA = [42, 58, 71, 65, 80, 95, 88, 102, 91, 115, 108, 124];

// Mock booking list shared across customer and manager views.
export const MOCK_BOOKINGS = [
  { id: "BK-2891", user: "Rahul Sharma", sport: "Badminton", court: "Court 1", time: "07:00–08:00", date: "Jun 10", status: "confirmed", amount: 350 },
  { id: "BK-2892", user: "Priya Patel", sport: "Table Tennis", court: "TT Table 2", time: "09:00–10:00", date: "Jun 10", status: "confirmed", amount: 200 },
  { id: "BK-2893", user: "Arjun Mehta", sport: "Football", court: "Turf A", time: "18:00–19:00", date: "Jun 10", status: "pending", amount: 1200 },
  { id: "BK-2894", user: "Sneha Joshi", sport: "Badminton", court: "Court 3", time: "20:00–21:00", date: "Jun 10", status: "cancelled", amount: 350 },
];
