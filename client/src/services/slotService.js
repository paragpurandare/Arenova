import api from "./api";

export const fetchSlots = async (courtId, date) => {
  const { data } = await api.get(`/courts/${courtId}/slots`, {
    params: { date },
  });
  return data;
};

export const blockSlot = async (courtId, payload) => {
  const { data } = await api.post(`/courts/${courtId}/slots/block`, payload);
  return data;
};

export const unblockSlot = async (courtId, slotId) => {
  const { data } = await api.delete(`/courts/${courtId}/slots/${slotId}/block`);
  return data;
};
