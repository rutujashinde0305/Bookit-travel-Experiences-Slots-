import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";

async function createBookingAPI(payload: any) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slotId: payload.slot_id,
      customerName: payload.user_name,
      customerEmail: payload.user_email,
      promoCodeId: payload.promo_code_id,
      numberOfPeople: payload.spots_booked,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create booking');
  }

  return response.json();
}

async function fetchBookingAPI(id: string) {
  const response = await fetch(`${API_URL}/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Booking not found');
  }
  return response.json();
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      return createBookingAPI(payload);
    },
  });
}

export function useBooking(bookingId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!bookingId) throw new Error("Booking ID is required");
      const data = await fetchBookingAPI(bookingId);
      if (!data) throw new Error('Booking not found');
      return data;
    },
  });
}