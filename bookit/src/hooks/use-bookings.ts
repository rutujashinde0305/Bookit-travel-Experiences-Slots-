import { useMutation } from "@tanstack/react-query";
import { createBooking as createBookingMock, fetchBooking as fetchBookingMock } from "@/mocks/api";

const API_URL = "http://localhost:3000";

async function createBookingAPI(payload: any) {
  // Map frontend payload (which may use snake_case from mocks) to backend camelCase API
  const body = {
    slotId: payload.slotId || payload.slot_id,
    customerName: payload.customerName || payload.user_name || payload.customer_name,
    customerEmail: payload.customerEmail || payload.user_email || payload.customer_email,
    promoCodeId: payload.promoCodeId || payload.promo_code_id || payload.promo_code || null,
    numberOfPeople: payload.numberOfPeople || payload.spots_booked || payload.number_of_people,
    totalPrice: payload.total_price || payload.totalPrice || 0,
    discountAmount: payload.discount_amount || payload.discountAmount || 0
  };

  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create booking');
  }

  return response.json();
}

async function fetchBookingAPI(id: string) {
  // If this looks like a mock booking id, use the mock fetch
  if (id.startsWith && id.startsWith('b_')) {
    return fetchBookingMock(id);
  }

  const response = await fetch(`${API_URL}/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Booking not found');
  }
  return response.json();
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      // If slot id is from mocks (e.g., 'slot_...'), use the mock createBooking so it matches frontend mock data
      if (payload && payload.slot_id && typeof payload.slot_id === 'string' && payload.slot_id.startsWith('slot_')) {
        return createBookingMock(payload);
      }

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