import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchSlotsByExperience, fetchSlot } from "@/mocks/api";

const API_URL = "http://localhost:3000";
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

type Slot = any;

async function fetchSlotsByExperienceAPI(experienceId: string) {
  const res = await fetch(`${API_URL}/experiences/${experienceId}`);
  if (!res.ok) throw new Error('Failed to fetch experience slots');
  const data = await res.json();
  return data.slots || [];
}

async function fetchSlotAPI(slotId: string) {
  const res = await fetch(`${API_URL}/slots/${slotId}`);
  if (!res.ok) throw new Error('Slot not found');
  return res.json();
}

export function useSlots(experienceId: string | undefined) {
  return useQuery<Slot[]>({
    queryKey: ["slots", experienceId],
    queryFn: async () => {
      if (!experienceId) throw new Error("Experience ID is required");
      return USE_MOCKS ? fetchSlotsByExperience(experienceId) : fetchSlotsByExperienceAPI(experienceId);
    },
    enabled: !!experienceId,
  });
}

export function useSlot(slotId: string | undefined) {
  return useQuery<Slot | null>({
    queryKey: ["slot", slotId],
    queryFn: async () => {
      if (!slotId) throw new Error("Slot ID is required");
      return USE_MOCKS ? fetchSlot(slotId) : fetchSlotAPI(slotId);
    },
    enabled: !!slotId,
  });
}

export function useUpdateSlotAvailability() {
  return useMutation({
    mutationFn: async (_args: any) => {
      // no-op in mock mode / handled by backend in API mode
      return { success: true };
    },
  });
}