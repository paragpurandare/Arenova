import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

/** Every user with the MANAGER role - used by the owner's assign-manager picker. */
export const getManagers = async () => {
  const { data } = await api.get("/auth/managers");
  return data;
};
