export const SPORTS_LIST = [
  { id: 1, name: "Badminton",      icon: "🏸", color: "#1D9E75", bg: "#E1F5EE" },
  { id: 2, name: "Football Turf",  icon: "⚽", color: "#185FA5", bg: "#E6F1FB" },
  { id: 3, name: "Cricket Nets",   icon: "🏏", color: "#BA7517", bg: "#FAEEDA" },
  { id: 4, name: "Table Tennis",   icon: "🏓", color: "#993556", bg: "#FBEAF0" },
  { id: 5, name: "Bowling",        icon: "🎳", color: "#534AB7", bg: "#EEEDFE" },
  { id: 6, name: "Pickleball",     icon: "🎾", color: "#639922", bg: "#EAF3DE" },
];

/** Backend SportsType enum → frontend sport id */
export const SPORTS_TYPE_MAP = {
  BADMINTON:    1,
  FOOTBALL:     2,
  CRICKET:      3,
  TABLE_TENNIS: 4,
  BOWLING:      5,
  PICKLEBALL:   6,
};

/** Frontend sport id → backend SportsType enum string */
export const SPORTS_ID_TO_TYPE = {
  1: "BADMINTON",
  2: "FOOTBALL",
  3: "CRICKET",
  4: "TABLE_TENNIS",
  5: "BOWLING",
  6: "PICKLEBALL",
};

export const DEF_CONFIG = {
  openTime: "06:00", closeTime: "22:00", slotDuration: 60,
  bufferTime: 0, maxPlayers: 4, active: true,
};

export const STATUS_BG = {
  confirmed: "#E1F5EE", pending: "#FAEEDA", cancelled: "#FCEBEB",
  active: "#E1F5EE", returned: "#f0ede6", damaged: "#FCEBEB",
  available: "#E1F5EE", AVAILABLE: "#E1F5EE",
  booked: "#FCEBEB",   BOOKED: "#FCEBEB",
  locked: "#FAEEDA",   BLOCKED: "#f0ede6",
  blocked: "#f0ede6",  EXPIRED: "#f5f5f5",
};

export const STATUS_COLOR = {
  confirmed: "#0F6E56", pending: "#854F0B", cancelled: "#A32D2D",
  active: "#0F6E56",    returned: "#888",   damaged: "#A32D2D",
  available: "#0F6E56", AVAILABLE: "#0F6E56",
  booked: "#A32D2D",    BOOKED: "#A32D2D",
  locked: "#854F0B",    BLOCKED: "#888",
  blocked: "#888",      EXPIRED: "#aaa",
};

export const getSport    = (id)       => SPORTS_LIST.find((s) => s.id === id);
export const getSportByType = (type)  => getSport(SPORTS_TYPE_MAP[type]);

/** Returns sport-specific equipment emojis based on equipment name or sport type */
export function getEquipmentEmoji(name = "", sportType = "") {
  const text = `${name} ${sportType}`.toLowerCase();
  if (text.includes("bat") || text.includes("cricket")) return "🏏";
  if (text.includes("racket") && text.includes("badminton")) return "🏸";
  if (text.includes("badminton") || text.includes("shuttle") || text.includes("cock")) return "🏸";
  if (text.includes("pickle") || text.includes("paddle")) return "🏓";
  if (text.includes("tennis") && (text.includes("ball") || text.includes("racket"))) return "🎾";
  if (text.includes("tennis")) return "🎾";
  if (text.includes("football") || text.includes("soccer")) return "⚽";
  if (text.includes("basketball") || text.includes("hoop")) return "🏀";
  if (text.includes("volleyball")) return "🏐";
  if (text.includes("bowling") || text.includes("pin")) return "🎳";
  if (text.includes("table tennis") || text.includes("ping pong")) return "🏓";
  if (text.includes("shoe") || text.includes("boot")) return "👟";
  if (text.includes("glove")) return "🧤";
  if (text.includes("helmet") || text.includes("guard") || text.includes("pad")) return "🛡️";
  if (text.includes("net") || text.includes("goal")) return "🥅";
  return "⚡";
}
