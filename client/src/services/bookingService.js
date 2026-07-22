import api from "./api";

export const initiateBooking = async (payload) => {
  const { data } = await api.post("/bookings/initiate", payload);
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await api.post("/bookings/verify", payload);
  return data;
};

export const fetchBookings = async () => {
  const { data } = await api.get("/bookings");
  return data;
};

export const returnRental = async (rentalId) => {
  const { data } = await api.post(`/rentals/${rentalId}/return`);
  return data;
};
