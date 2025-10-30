import { useQuery } from "@tanstack/react-query";
import { fetchExperiences, fetchExperience } from "@/mocks/api";

const API_URL = "http://localhost:3000";
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

type Experience = any;

export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      if (USE_MOCKS) return fetchExperiences();
      const res = await fetch(`${API_URL}/experiences`);
      if (!res.ok) throw new Error('Failed to fetch experiences');
      return res.json();
    },
  });
}

export function useExperience(id: string | undefined) {
  return useQuery<Experience | null>({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (!id) throw new Error("Experience ID is required");
      if (USE_MOCKS) return fetchExperience(id);
      const res = await fetch(`${API_URL}/experiences/${id}`);
      if (!res.ok) throw new Error('Experience not found');
      return res.json();
    },
    enabled: !!id,
  });
}