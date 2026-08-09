import api from "./api";

/**
 * Fetch all slots for a court on a given date.
 * @param {number} courtId
 * @param {string} slotDate  ISO date string "YYYY-MM-DD"
 */
export const fetchSlots = async (courtId, slotDate) => {
  const { data } = await api.get("/slots", { params: { courtId, slotDate } });
  return data;
};

/** Get a single slot by ID. */
export const fetchSlotById = async (slotId) => {
  const { data } = await api.get(`/slots/${slotId}`);
  return data;
};

/** Block a slot (MANAGER only). */
export const blockSlot = async (slotId) => {
  const { data } = await api.put(`/slots/${slotId}/block`);
  return data;
};

/** Unblock a slot (MANAGER only). */
export const unblockSlot = async (slotId) => {
  const { data } = await api.put(`/slots/${slotId}/unblock`);
  return data;
};
