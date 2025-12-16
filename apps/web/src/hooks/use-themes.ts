import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const themesQueryKey = ["themes"] as const;

export function useThemes() {
	return useQuery({
		queryKey: themesQueryKey,
		queryFn: api.themes.getAll,
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});
}
