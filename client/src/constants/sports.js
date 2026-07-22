// ─── SPORT CATALOG ─────────────────────────────────────────────────────────
// Central list of sports offered across the platform. Each entry carries a
// distinct color ramp used consistently across cards, badges, and filters.
export const SPORTS_LIST = [
  { id: 1, name: "Badminton", icon: "🏸", color: "#1D9E75", bg: "#E1F5EE" },
  { id: 2, name: "Football Turf", icon: "⚽", color: "#185FA5", bg: "#E6F1FB" },
  { id: 3, name: "Cricket Nets", icon: "🏏", color: "#BA7517", bg: "#FAEEDA" },
  { id: 4, name: "Table Tennis", icon: "🏓", color: "#993556", bg: "#FBEAF0" },
  { id: 5, name: "Bowling", icon: "🎳", color: "#534AB7", bg: "#EEEDFE" },
  { id: 6, name: "Pickleball", icon: "🎾", color: "#639922", bg: "#EAF3DE" },
];

// Default court operating configuration applied when a new court is created.
export const DEF_CONFIG = {
  openTime: "06:00",
  closeTime: "22:00",
  slotDuration: 60,
  bufferTime: 0,
  maxPlayers: 4,
  active: true,
};

// Status color maps reused across bookings, rentals, and slot grids.
export const STATUS_BG = {
  confirmed: "#E1F5EE", pending: "#FAEEDA", cancelled: "#FCEBEB",
  active: "#E1F5EE", returned: "#f0ede6", damaged: "#FCEBEB",
  available: "#E1F5EE", booked: "#FCEBEB", locked: "#FAEEDA", blocked: "#f0ede6",
};
export const STATUS_COLOR = {
  confirmed: "#0F6E56", pending: "#854F0B", cancelled: "#A32D2D",
  active: "#0F6E56", returned: "#888", damaged: "#A32D2D",
  available: "#0F6E56", booked: "#A32D2D", locked: "#854F0B", blocked: "#888",
};

// Helper to look up a sport by id.
export const getSport = (id) => SPORTS_LIST.find((s) => s.id === id);
