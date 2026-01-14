import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const questionQueryKey = (id: string) => ["question", id] as const;

export function useQuestion(id: string) {
	return useQuery({
		queryKey: questionQueryKey(id),
		queryFn: () => api.questions.getById(id),
		enabled: !!id,
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});
}
