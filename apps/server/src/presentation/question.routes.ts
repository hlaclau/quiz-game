import { Elysia, t } from "elysia";
import { CreateQuestionHandler } from "../application/commands/create-question/create-question.handler";
import type { IQuestionRepository } from "../domain/interfaces/question-repository.interface";

/**
 * Question Routes
 */
export const createQuestionRoutes = (questionRepository: IQuestionRepository) => {
	const createQuestionHandler = new CreateQuestionHandler(questionRepository);

	return new Elysia({ prefix: "/api/questions" }).post(
		"/",
		async ({ body, set }) => {
			try {
				const result = await createQuestionHandler.execute(body);
				set.status = 201;
				return result;
			} catch (error) {
				console.error("Error creating question:", error);
				set.status = 500;
				return { error: "Internal server error" };
			}
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
					{ minItems: 2 },
				),
				tagIds: t.Optional(t.Array(t.String())),
			}),
		},
	);
};
