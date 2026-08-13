import api from "./api";

/**
 * Fetch all active equipment for a club catalog.
 */
export const fetchEquipmentByClub = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/equipment`);
  return data;
};

/**
 * Fetch equipment availability for a club on a specific date.
 */
export const fetchEquipmentAvailability = async (clubId, date) => {
  const { data } = await api.get(`/clubs/${clubId}/equipment/availability`, {
    params: { date },
  });
  return data;
};

/**
 * Fetch single equipment details by ID.
 */
export const fetchEquipmentById = async (id) => {
  const { data } = await api.get(`/equipment/${id}`);
  return data;
};

/**
 * Create new equipment for a club (OWNER/ADMIN).
 */
export const createEquipment = async (clubId, payload) => {
  const { data } = await api.post(`/clubs/${clubId}/equipment`, payload);
  return data;
};

/**
 * Update equipment details (OWNER/ADMIN).
 */
export const updateEquipment = async (id, payload) => {
  const { data } = await api.put(`/equipment/${id}`, payload);
  return data;
};

/**
 * Deactivate equipment (OWNER/ADMIN).
 */
export const deactivateEquipment = async (id) => {
  const { data } = await api.delete(`/equipment/${id}`);
  return data;
};
