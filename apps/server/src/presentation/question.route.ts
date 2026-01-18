import { Elysia, t } from "elysia";
import type {
	GetRandomQuestionsUseCase,
	ValidateAnswerUseCase,
} from "../application/use-cases";

/**
 * Question Route (singular)
 * Returns random validated questions by theme (no duplicates)
 */
export const createQuestionRoute = (
	getRandomQuestionsUseCase: GetRandomQuestionsUseCase,
	validateAnswerUseCase: ValidateAnswerUseCase,
) => {
	return new Elysia({ prefix: "/api/question" }).get(
		"/",
		async ({ query, set }) => {
			const limit = query.limit ?? 10;
			const result = await getRandomQuestionsUseCase.execute({
				themeId: query.themeId,
				limit,
			});

			if (result.data.length === 0) {
				set.status = 404;
				return { error: "No questions found for this theme" };
			}

			return result;
		},
		{
			query: t.Object({
				themeId: t.String(),
				limit: t.Optional(t.Number({ minimum: 1, maximum: 50 })),
			}),
		},
	).post(
		"/validate",
		async ({ body, set }) => {
			try {
				const result = await validateAnswerUseCase.execute({
					questionId: body.questionId,
					answerId: body.answerId,
				});
				return result;
			} catch (error) {
				set.status = 404;
				return { error: (error as Error).message };
			}
		},
		{
			body: t.Object({
				questionId: t.String(),
				answerId: t.String(),
			}),
		},
	);
};
