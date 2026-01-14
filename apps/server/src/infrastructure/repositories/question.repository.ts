import { and, count, type Database, eq, inArray, sql } from "@quiz-game/db";
import {
	answer as answerTable,
	question as questionTable,
	questionTag as questionTagTable,
} from "@quiz-game/db/schema/index";
import { Answer } from "../../domain/entities/answer";
import { Question } from "../../domain/entities/question";
import type {
	CreateQuestionInput,
	FindQuestionsFilter,
	IQuestionRepository,
	PaginatedResult,
	PaginationOptions,
	QuestionWithAnswers,
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
			validated: result.validated,
			createdAt: result.createdAt,
			updatedAt: result.updatedAt,
		});
	}

	async findById(id: string): Promise<QuestionWithAnswers | null> {
		const questionRows = await this.db
			.select()
			.from(questionTable)
			.where(eq(questionTable.id, id))
			.limit(1);

		const questionRow = questionRows[0];
		if (!questionRow) return null;

		const answerRows = await this.db
			.select()
			.from(answerTable)
			.where(eq(answerTable.questionId, id));

		const question = Question.create({
			id: questionRow.id,
			content: questionRow.content,
			explanation: questionRow.explanation,
			difficultyId: questionRow.difficultyId,
			themeId: questionRow.themeId,
			authorId: questionRow.authorId,
			validated: questionRow.validated,
			createdAt: questionRow.createdAt,
			updatedAt: questionRow.updatedAt,
		});

		const answers = answerRows.map((row) =>
			Answer.create({
				id: row.id,
				content: row.content,
				isCorrect: row.isCorrect,
				questionId: row.questionId,
				createdAt: row.createdAt,
			}),
		);

		return { question, answers };
	}

	async findAll(
		filter: FindQuestionsFilter,
		pagination: PaginationOptions,
	): Promise<PaginatedResult<Question>> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		const baseQuery = this.db.select().from(questionTable);
		const countQuery = this.db.select({ count: count() }).from(questionTable);

		const whereCondition = filter.themeId
			? eq(questionTable.themeId, filter.themeId)
			: undefined;

		const [rows, countResult] = await Promise.all([
			whereCondition
				? baseQuery.where(whereCondition).limit(limit).offset(offset)
				: baseQuery.limit(limit).offset(offset),
			whereCondition ? countQuery.where(whereCondition) : countQuery,
		]);

		const total = countResult[0]?.count ?? 0;

		const data = rows.map((row) =>
			Question.create({
				id: row.id,
				content: row.content,
				explanation: row.explanation,
				difficultyId: row.difficultyId,
				themeId: row.themeId,
				authorId: row.authorId,
				validated: row.validated,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			}),
		);

		return { data, total };
	}

	async findRandomByTheme(
		themeId: string,
		limit: number,
	): Promise<QuestionWithAnswers[]> {
		// Get random unique questions by theme
		const questionRows = await this.db
			.select()
			.from(questionTable)
			.where(
				and(
					eq(questionTable.themeId, themeId),
					eq(questionTable.validated, true),
				),
			)
			.orderBy(sql`RANDOM()`)
			.limit(limit);

		if (questionRows.length === 0) return [];

		// Get all answers for the selected questions in one query
		const questionIds = questionRows.map((q) => q.id);
		const answerRows = await this.db
			.select()
			.from(answerTable)
			.where(inArray(answerTable.questionId, questionIds));

		// Group answers by questionId
		const answersByQuestionId = new Map<string, typeof answerRows>();
		for (const row of answerRows) {
			const existing = answersByQuestionId.get(row.questionId) ?? [];
			existing.push(row);
			answersByQuestionId.set(row.questionId, existing);
		}

		// Map to domain entities
		return questionRows.map((questionRow) => {
			const question = Question.create({
				id: questionRow.id,
				content: questionRow.content,
				explanation: questionRow.explanation,
				difficultyId: questionRow.difficultyId,
				themeId: questionRow.themeId,
				authorId: questionRow.authorId,
				validated: questionRow.validated,
				createdAt: questionRow.createdAt,
				updatedAt: questionRow.updatedAt,
			});

			const questionAnswers = answersByQuestionId.get(questionRow.id) ?? [];
			const answers = questionAnswers.map((row) =>
				Answer.create({
					id: row.id,
					content: row.content,
					isCorrect: row.isCorrect,
					questionId: row.questionId,
					createdAt: row.createdAt,
				}),
			);

			return { question, answers };
		});
	}
}
