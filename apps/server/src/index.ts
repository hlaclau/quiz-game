import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { auth } from "@quiz-game/auth";
import { db } from "@quiz-game/db";
import { answer, question, questionTag } from "@quiz-game/db/schema/quiz";
import { Elysia } from "elysia";
import { z } from "zod";

const createQuestionSchema = z.object({
	content: z.string().min(1, "Question content is required"),
	explanation: z.string().optional(),
	difficulty: z.number().int().min(1).max(3).optional(),
	themeId: z.string().min(1, "Theme ID is required"),
	answers: z
		.array(
			z.object({
				content: z.string().min(1, "Answer content is required"),
				isCorrect: z.boolean(),
			}),
		)
		.min(2, "At least 2 answers are required")
		.refine(
			(answers) => answers.some((a) => a.isCorrect),
			"At least one answer must be correct",
		),
	tagIds: z.array(z.string()).optional(),
});

const app = new Elysia()
	// .use(
	// 	cors({
	// 		origin: process.env.CORS_ORIGIN || "",
	// 		methods: ["GET", "POST", "OPTIONS"],
	// 		allowedHeaders: ["Content-Type", "Authorization"],
	// 		credentials: true,
	// 	}),
	// )
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.get("/", () => "OK")
	.post("/api/questions", async ({ body, set }) => {
		try {
			console.log("Received body:", JSON.stringify(body, null, 2));
			const parsed = createQuestionSchema.safeParse(body);
			if (!parsed.success) {
				console.log("Validation errors:", parsed.error.flatten());
				set.status = 400;
				return {
					error: "Validation failed",
					details: parsed.error.flatten().fieldErrors,
				};
			}

			const { content, explanation, difficulty, themeId, answers, tagIds } =
				parsed.data;

			const questionId = crypto.randomUUID();
			const authorId = "temp-author-id"; // TODO: get from auth

			await db.transaction(async (tx) => {
				await tx.insert(question).values({
					id: questionId,
					content,
					explanation,
					difficulty,
					themeId,
					authorId,
				});

				await tx.insert(answer).values(
					answers.map((a) => ({
						id: crypto.randomUUID(),
						content: a.content,
						isCorrect: a.isCorrect,
						questionId,
					})),
				);

				if (tagIds && tagIds.length > 0) {
					await tx.insert(questionTag).values(
						tagIds.map((tagId) => ({
							questionId,
							tagId,
						})),
					);
				}
			});

			set.status = 201;
			return { id: questionId, message: "Question created successfully" };
		} catch (error) {
			console.error("Error creating question:", error);
			set.status = 500;
			return { error: "Internal server error" };
		}
	})
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
