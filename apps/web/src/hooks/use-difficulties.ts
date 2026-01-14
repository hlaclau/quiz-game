import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const difficultiesQueryKey = ["difficulties"] as const;

export function useDifficulties() {
	return useQuery({
		queryKey: difficultiesQueryKey,
		queryFn: api.difficulties.getAll,
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});
}
