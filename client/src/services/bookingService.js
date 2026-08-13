import api from "./api";

/**
 * Create a new booking (Slot + optional Equipment + Payment initiation)
 * payload: { slotId, userId, paymentMethod, equipmentItems: [{ equipmentId, quantity }] }
 */
export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

/**
 * Confirm a booking after payment completion.
 */
export const confirmBooking = async (bookingId, gatewayTxnId) => {
  const { data } = await api.put(`/bookings/${bookingId}/confirm`, null, {
    params: { gatewayTxnId },
  });
  return data;
};

/**
 * Cancel a booking and release slot / equipment stock.
 */
export const cancelBooking = async (bookingId) => {
  const { data } = await api.put(`/bookings/${bookingId}/cancel`);
  return data;
};

/**
 * Fetch booking by ID.
 */
export const fetchBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

/**
 * Fetch all bookings for a user.
 */
export const fetchUserBookings = async (userId) => {
  const { data } = await api.get(`/bookings/user/${userId}`);
  return data;
};

/**
 * Fetch all equipment rentals for a user.
 */
export const fetchUserRentals = async (userId) => {
  const { data } = await api.get(`/rentals/user/${userId}`);
  return data;
};

/**
 * Mark rental picked up (Manager/Owner/Admin).
 */
export const markRentalPickup = async (rentalId) => {
  const { data } = await api.put(`/rentals/${rentalId}/pickup`);
  return data;
};

/**
 * Mark rental returned (Manager/Owner/Admin).
 */
export const markRentalReturn = async (rentalId) => {
  const { data } = await api.put(`/rentals/${rentalId}/return`);
  return data;
};

/**
 * Fetch all bookings for a club (Manager/Owner view).
 */
export const fetchClubBookings = async (clubId) => {
  const { data } = await api.get(`/bookings/club/${clubId}`);
  return data;
};
