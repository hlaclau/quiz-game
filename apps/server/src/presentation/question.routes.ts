import { Elysia, t } from "elysia";
import type { CreateQuestionHandler } from "../application/commands/create-question/create-question.handler";
import { REQUIRED_ANSWERS_COUNT } from "../domain/entities/question";

/**
 * Question Routes
 */
export const createQuestionRoutes = (
	createQuestionHandler: CreateQuestionHandler,
) => {
	return new Elysia({ prefix: "/api/questions" })
		.onError(({ code, set }) => {
			if (code === "VALIDATION") {
				set.status = 400;
				return {
					error: `A question must have exactly ${REQUIRED_ANSWERS_COUNT} answers`,
				};
			}
		})
		.post(
			"/",
			async ({ body, set }) => {
				await createQuestionHandler.execute(body);
				set.status = 201;
			},
			{
				body: t.Object({
					content: t.String({ minLength: 1 }),
					explanation: t.Optional(t.Union([t.String(), t.Null()])),
					difficultyId: t.String({ minLength: 1 }),
					themeId: t.String({ minLength: 1 }),
					authorId: t.String({ minLength: 1 }),
					answers: t.Array(
						t.Object({
							content: t.String({ minLength: 1 }),
							isCorrect: t.Boolean(),
						}),
						{
							minItems: REQUIRED_ANSWERS_COUNT,
							maxItems: REQUIRED_ANSWERS_COUNT,
						},
					),
					tagIds: t.Optional(t.Array(t.String())),
				}),
			},
		);
};
