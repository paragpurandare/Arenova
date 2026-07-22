import api from "./api";

export const fetchEquipment = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/equipment`);
  return data;
};

export const addEquipment = async (clubId, payload) => {
  const { data } = await api.post(`/clubs/${clubId}/equipment`, payload);
  return data;
};

export const updateEquipment = async (equipmentId, payload) => {
  const { data } = await api.put(`/equipment/${equipmentId}`, payload);
  return data;
};

export const updateStock = async (equipmentId, stockCount) => {
  const { data } = await api.patch(`/equipment/${equipmentId}/stock`, {
    stockCount,
  });
  return data;
};

export const deleteEquipment = async (equipmentId) => {
  const { data } = await api.delete(`/equipment/${equipmentId}`);
  return data;
};
