import { Elysia, t } from "elysia";
import type {
	CreateQuestionUseCase,
	GetQuestionByIdUseCase,
	GetQuestionsUseCase,
	SetQuestionValidationUseCase,
} from "../application/use-cases";
import { REQUIRED_ANSWERS_COUNT } from "../domain/entities/question";

/**
 * Question Routes
 */
export const createQuestionRoutes = (
	createQuestionUseCase: CreateQuestionUseCase,
	getQuestionByIdUseCase: GetQuestionByIdUseCase,
	getQuestionsUseCase: GetQuestionsUseCase,
	setQuestionValidationUseCase: SetQuestionValidationUseCase,
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
		.get(
			"/",
			async ({ query }) => {
				const page = query.page ?? 1;
				const limit = query.limit ?? 10;

				return getQuestionsUseCase.execute({
					page,
					limit,
					themeId: query.themeId,
					validated: query.validated,
					sortBy: query.sortBy,
					sortOrder: query.sortOrder,
				});
			},
			{
				query: t.Object({
					page: t.Optional(t.Number({ minimum: 1 })),
					limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
					themeId: t.Optional(t.String()),
					validated: t.Optional(t.Boolean()),
					sortBy: t.Optional(
						t.Union([t.Literal("createdAt"), t.Literal("updatedAt")]),
					),
					sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
				}),
			},
		)
		.get(
			"/:id",
			async ({ params, set }) => {
				const result = await getQuestionByIdUseCase.execute({ id: params.id });
				if (!result.data) {
					set.status = 404;
					return { error: "Question not found" };
				}
				return result;
			},
			{
				params: t.Object({
					id: t.String(),
				}),
			},
		)
		.post(
			"/",
			async ({ body, set }) => {
				await createQuestionUseCase.execute(body);
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
		)
		.patch(
			"/:id/validation",
			async ({ params, body, set }) => {
				const result = await setQuestionValidationUseCase.execute({
					id: params.id,
					validated: body.validated,
				});
				if (!result.data) {
					set.status = 404;
					return { error: "Question not found" };
				}
				return result;
			},
			{
				params: t.Object({
					id: t.String(),
				}),
				body: t.Object({
					validated: t.Boolean(),
				}),
			},
		);
};
