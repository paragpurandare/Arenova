import api from "./api";

/** Every club on the platform, any status - for the admin review queue. */
export const fetchAllClubsAdmin = async () => {
  const { data } = await api.get("/admin/clubs");
  return data;
};

/** status: "ACTIVE" | "PENDING" | "SUSPENDED" */
export const updateClubStatus = async (clubId, status) => {
  const { data } = await api.put(`/admin/clubs/${clubId}/status`, { status });
  return data;
};
