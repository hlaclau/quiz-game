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
		const questionId = crypto.randomUUID();
		const now = new Date();

		const result = await this.db.transaction(async (tx) => {
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

			const row = rows[0];
			if (!row) {
				throw new Error("Failed to create question");
			}

			// Insert answers
			await tx.insert(answerTable).values(
				input.answers.map((a) => ({
					id: crypto.randomUUID(),
					content: a.content,
					isCorrect: a.isCorrect,
					questionId,
					createdAt: now,
				})),
			);

			// Insert tags if provided
			if (input.tagIds && input.tagIds.length > 0) {
				await tx.insert(questionTagTable).values(
					input.tagIds.map((tagId) => ({
						questionId,
						tagId,
					})),
				);
			}

			return row;
		});

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
	}
}
