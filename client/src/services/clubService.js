import api from "./api";

export const fetchNearbyClubs = async (lat, lng, radiusKm = 10) => {
  const { data } = await api.get("/clubs/nearby", {
    params: { lat, lng, radiusKm },
  });
  return data;
};

export const fetchClubs = async () => {
  const { data } = await api.get("/clubs");
  return data;
};

export const fetchClubById = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}`);
  return data;
};

export const fetchCourts = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/courts`);
  return data;
};

export const fetchCourtConfigs = async (courtId) => {
  const { data } = await api.get(`/courts/${courtId}/configs`);
  return data;
};

export const fetchEquipmentCatalog = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/equipment`);
  return data;
};

export const createClub = async (payload) => {
  const { data } = await api.post("/clubs", payload);
  return data;
};
