import type { Experience, Slot, PromoCode, Booking } from './data';
import { experiences, slots, promo_codes, bookings } from './data';

function delay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchExperiences() {
  await delay();
  return experiences;
}

export async function fetchExperience(id: string) {
  await delay();
  return experiences.find((e: Experience) => e.id === id) || null;
}

export async function fetchSlotsByExperience(experienceId: string) {
  await delay();
  return slots.filter((s: Slot) => s.experience_id === experienceId && s.date >= new Date().toISOString().split('T')[0]);
}

export async function fetchSlot(slotId: string) {
  await delay();
  return slots.find((s: Slot) => s.id === slotId) || null;
}

export async function validatePromo(code: string) {
  await delay();
  const p = promo_codes.find((x: PromoCode) => x.code.toUpperCase() === code.toUpperCase());
  if (!p) return { valid: false };
  if (new Date(p.valid_until) < new Date()) return { valid: false };
  // Return discount_percent under the key expected by callers (discount_percentage)
  return { valid: true, discount_percentage: p.discount_percent, id: p.id };
}

export async function createBooking(payload: any) {
  await delay();
  // simple availability check + decrement mock slot
  const slot = slots.find((s: Slot) => s.id === payload.slot_id);
  if (!slot) throw new Error('Slot not found');
  if (slot.available_spots < payload.spots_booked) throw new Error('Not enough spots');

  slot.available_spots -= payload.spots_booked;

  const booking = {
    id: `b_${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  };
  bookings.push(booking);
  // if promo applied, increment mock usage
  if (payload.promo_code) {
    // We don't track usage in the simplified mock promo schema; noop here.
    // If needed, implement uses_count in PromoCode and increment it.
    void promo_codes.find((x: PromoCode) => x.code === payload.promo_code);
  }
  return booking;
}

export async function fetchBooking(id: string) {
  await delay();
  const b = bookings.find((x: Booking) => x.id === id);
  if (!b) return null;
  const slot = slots.find((s: Slot) => s.id === b.slot_id);
  const experience = slot ? experiences.find((e: Experience) => e.id === slot.experience_id) : null;
  return { ...b, slots: { ...(slot || {}), experiences: experience } };
}
