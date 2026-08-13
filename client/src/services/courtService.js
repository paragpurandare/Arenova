import api from "./api";

/** Fetch ALL courts for a club (owner / manager view — includes inactive). */
export const fetchCourts = async (clubId) => {
  const { data } = await api.get(`/courts/${clubId}`);
  return data;
};

/** Fetch only ACTIVE courts for a club (customer view). */
export const fetchActiveCourts = async (clubId) => {
  const { data } = await api.get(`/courts/active/${clubId}`);
  return data;
};

/** Create a new court (OWNER only).
 *  payload: { name, sportsType, clubId }
 */
export const createCourt = async (payload) => {
  const { data } = await api.post("/courts", payload);
  return data;
};

/** Edit court properties (OWNER / MANAGER).
 *  courtId: the court's id
 *  payload: CourtEditDTO fields — name, sportsType, clubId, openTime, closeTime,
 *           active, bufferTime, slotDuration, maxPlayers
 */
export const updateCourt = async (courtId, payload) => {
  const { data } = await api.put(`/courts/${courtId}`, payload);
  return data;
};
