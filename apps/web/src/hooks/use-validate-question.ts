import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SetValidationParams {
	id: string;
	validated: boolean;
}

export function useSetQuestionValidation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, validated }: SetValidationParams) =>
			api.questions.setValidation(id, validated),
		onSuccess: () => {
			// Invalidate all questions queries to refetch with updated validation status
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			// Also invalidate the single question query
			queryClient.invalidateQueries({ queryKey: ["question"] });
		},
	});
}
