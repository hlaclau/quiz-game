import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type GetQuestionsParams } from "@/lib/api";

export const questionsQueryKey = (params: GetQuestionsParams) =>
	["questions", params] as const;

export function useQuestions(params: GetQuestionsParams = {}) {
	return useQuery({
		queryKey: questionsQueryKey(params),
		queryFn: () => api.questions.getAll(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 2, // Cache for 2 minutes
	});
}
