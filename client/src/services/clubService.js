import api from "./api";

export const fetchClubs = async () => {
  const { data } = await api.get("/clubs");
  return data;
};

export const fetchClubById = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}`);
  return data;
};

export const createClub = async (payload) => {
  const { data } = await api.post("/clubs", payload);
  return data;
};
