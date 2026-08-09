import api from "./api";

/**
 * Fetch clubs owned by a specific owner.
 * @param {number} ownerId
 */
export const fetchOwnerClubs = async (ownerId) => {
  const { data } = await api.get("/clubs", { params: { ownerId } });
  return data;
};

/**
 * Fetch nearby clubs using the Haversine endpoint.
 * Returns NearbyClubResponseDTO[] with distanceKm included.
 */
export const fetchNearbyClubs = async (lat, lng, radiusKm = 10) => {
  const { data } = await api.get("/clubs/nearby", {
    params: { lat, lng, radiusKm },
  });
  return data;
};

/**
 * Fetch the club assigned to the currently-authenticated manager.
 * Uses GET /api/clubs/manager-club (reads from ClubManager entity).
 */
export const fetchManagerClub = async () => {
  const { data } = await api.get("/clubs/manager-club");
  return data; // ClubResponseDTO
};

/** Create a new club (OWNER only). */
export const createClub = async (payload) => {
  const { data } = await api.post("/clubs", payload);
  return data;
};

/** Assign a manager to one of the owner's own clubs. */
export const assignManager = async (clubId, managerId) => {
  const { data } = await api.post(`/clubs/${clubId}/manager`, { managerId });
  return data;
};

/** Remove whichever manager currently runs this club. */
export const unassignManager = async (clubId) => {
  const { data } = await api.delete(`/clubs/${clubId}/manager`);
  return data;
};

/** Who (if anyone) currently manages this club. */
export const getClubManager = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/manager`);
  return data;
};
