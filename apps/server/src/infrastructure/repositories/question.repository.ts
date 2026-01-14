import { and, asc, count, type Database, desc, eq } from "@quiz-game/db";
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
	SortOptions,
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
		sort?: SortOptions,
	): Promise<PaginatedResult<Question>> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		// Build where conditions
		const conditions = [
			[
				Boolean(filter.themeId),
				() => eq(questionTable.themeId, filter.themeId!),
			],
			[
				filter.validated !== undefined,
				() => eq(questionTable.validated, filter.validated!),
			],
		]
			.filter(([predicate]) => predicate)
			.map(([, buildCondition]) => buildCondition());

		const whereCondition =
			conditions.length > 0 ? and(...conditions) : undefined;

		// Build sort order
		const sortField = sort?.sortBy ?? "createdAt";
		const sortOrder = sort?.sortOrder ?? "desc";
		const orderBy =
			sortOrder === "asc"
				? asc(questionTable[sortField])
				: desc(questionTable[sortField]);

		const countQuery = this.db.select({ count: count() }).from(questionTable);

		const [rows, countResult] = await Promise.all([
			whereCondition
				? this.db
						.select()
						.from(questionTable)
						.where(whereCondition)
						.orderBy(orderBy)
						.limit(limit)
						.offset(offset)
				: this.db
						.select()
						.from(questionTable)
						.orderBy(orderBy)
						.limit(limit)
						.offset(offset),
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

	async setQuestionValidation(
		id: string,
		validated: boolean,
	): Promise<Question | null> {
		const rows = await this.db
			.update(questionTable)
			.set({ validated, updatedAt: new Date() })
			.where(eq(questionTable.id, id))
			.returning();

		const row = rows[0];
		if (!row) return null;

		return Question.create({
			id: row.id,
			content: row.content,
			explanation: row.explanation,
			difficultyId: row.difficultyId,
			themeId: row.themeId,
			authorId: row.authorId,
			validated: row.validated,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		});
	}
}
