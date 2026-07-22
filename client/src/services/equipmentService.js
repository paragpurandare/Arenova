import api from "./api";

export const fetchEquipment = async (clubId) => {
  const { data } = await api.get(`/clubs/${clubId}/equipment`);
  return data;
};

export const updateStock = async (equipmentId, stockCount) => {
  const { data } = await api.patch(`/equipment/${equipmentId}/stock`, { stockCount });
  return data;
};
