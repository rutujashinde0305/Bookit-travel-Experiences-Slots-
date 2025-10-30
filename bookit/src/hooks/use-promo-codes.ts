import { useMutation } from "@tanstack/react-query";
import { validatePromo } from "@/mocks/api";

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async (arg: unknown) => {
      const code = String(arg);
      const res = await validatePromo(code);
      if (!res.valid) throw new Error('Invalid promo code');
      return res;
    },
  });
}

export function useUpdatePromoCodeUsage() {
  return useMutation({
    mutationFn: async (_arg: unknown) => {
      // In mock mode, validatePromo already increments in createBooking; this is a no-op
      return { success: true };
    },
  });
}