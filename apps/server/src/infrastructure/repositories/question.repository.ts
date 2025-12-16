import type { Database } from "@quiz-game/db";
import {
	answer as answerTable,
	question as questionTable,
	questionTag as questionTagTable,
} from "@quiz-game/db/schema/index";
import { Question } from "../../domain/entities/question";
import type {
	CreateQuestionInput,
	IQuestionRepository,
} from "../../domain/interfaces/question-repository.interface";

/**
 * Drizzle implementation of IQuestionRepository
 */
export class DrizzleQuestionRepository implements IQuestionRepository {
	constructor(private readonly db: Database) {}

	async create(input: CreateQuestionInput): Promise<Question> {
		console.log("[QuestionRepository] Starting create...");
		console.log("[QuestionRepository] Input:", JSON.stringify(input, null, 2));

		const questionId = crypto.randomUUID();
		const now = new Date();

		console.log("[QuestionRepository] Generated questionId:", questionId);

		try {
			const result = await this.db.transaction(async (tx) => {
				console.log("[QuestionRepository] Inserting question...");
				const rows = await tx
					.insert(questionTable)
					.values({
						id: questionId,
						content: input.content,
						explanation: input.explanation,
						difficultyId: input.difficultyId,
						themeId: input.themeId,
						authorId: input.authorId,
						createdAt: now,
						updatedAt: now,
					})
					.returning();

				console.log(
					"[QuestionRepository] Question inserted, rows:",
					rows.length,
				);

				const row = rows[0];
				if (!row) {
					throw new Error("Failed to create question");
				}

				// Insert answers
				console.log(
					"[QuestionRepository] Inserting answers...",
					input.answers.length,
				);
				await tx.insert(answerTable).values(
					input.answers.map((a) => ({
						id: crypto.randomUUID(),
						content: a.content,
						isCorrect: a.isCorrect,
						questionId,
						createdAt: now,
					})),
				);
				console.log("[QuestionRepository] Answers inserted");

				// Insert tags if provided
				if (input.tagIds && input.tagIds.length > 0) {
					console.log(
						"[QuestionRepository] Inserting tags...",
						input.tagIds.length,
					);
					await tx.insert(questionTagTable).values(
						input.tagIds.map((tagId) => ({
							questionId,
							tagId,
						})),
					);
					console.log("[QuestionRepository] Tags inserted");
				}

				return row;
			});

			console.log("[QuestionRepository] Transaction completed successfully");

			return Question.create({
				id: result.id,
				content: result.content,
				explanation: result.explanation,
				difficultyId: result.difficultyId,
				themeId: result.themeId,
				authorId: result.authorId,
				createdAt: result.createdAt,
				updatedAt: result.updatedAt,
			});
		} catch (error) {
			console.error("[QuestionRepository] Error:", error);
			throw error;
		}
	}
}
