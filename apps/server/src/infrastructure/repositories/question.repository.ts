import {
	and,
	asc,
	count,
	type Database,
	desc,
	eq,
	inArray,
	sql,
} from "@quiz-game/db";
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
	UpdateQuestionInput,
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

	async update(
		input: UpdateQuestionInput,
	): Promise<QuestionWithAnswers | null> {
		const now = new Date();

		const result = await this.db.transaction(async (tx) => {
			// Update question
			const rows = await tx
				.update(questionTable)
				.set({
					content: input.content,
					explanation: input.explanation,
					difficultyId: input.difficultyId,
					themeId: input.themeId,
					updatedAt: now,
				})
				.where(eq(questionTable.id, input.id))
				.returning();

			const row = rows[0];
			if (!row) {
				return null;
			}

			// Delete existing answers and insert new ones
			await tx.delete(answerTable).where(eq(answerTable.questionId, input.id));

			const answerRows = await tx
				.insert(answerTable)
				.values(
					input.answers.map((a) => ({
						id: a.id ?? crypto.randomUUID(),
						content: a.content,
						isCorrect: a.isCorrect,
						questionId: input.id,
						createdAt: now,
					})),
				)
				.returning();

			// Update tags if provided
			await tx
				.delete(questionTagTable)
				.where(eq(questionTagTable.questionId, input.id));

			if (input.tagIds && input.tagIds.length > 0) {
				await tx.insert(questionTagTable).values(
					input.tagIds.map((tagId) => ({
						questionId: input.id,
						tagId,
					})),
				);
			}

			return { questionRow: row, answerRows };
		});

		if (!result) return null;

		const question = Question.create({
			id: result.questionRow.id,
			content: result.questionRow.content,
			explanation: result.questionRow.explanation,
			difficultyId: result.questionRow.difficultyId,
			themeId: result.questionRow.themeId,
			authorId: result.questionRow.authorId,
			validated: result.questionRow.validated,
			createdAt: result.questionRow.createdAt,
			updatedAt: result.questionRow.updatedAt,
		});

		const answers = result.answerRows.map((row) =>
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
		const conditions: Array<ReturnType<typeof eq>> = [];

		if (filter.themeId) {
			conditions.push(eq(questionTable.themeId, filter.themeId));
		}

		if (filter.validated !== undefined) {
			conditions.push(eq(questionTable.validated, filter.validated));
		}
		const hasConditions = conditions.length > 0;
		const whereCondition = hasConditions ? and(...conditions) : undefined;

		// Build sort order
		const sortField = sort?.sortBy ?? "createdAt";
		const sortOrder = sort?.sortOrder ?? "desc";
		const sortFieldToColumn = {
			createdAt: questionTable.createdAt,
			updatedAt: questionTable.updatedAt,
		} as const;
		const sortColumn = sortFieldToColumn[sortField];
		const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

		// Build base queries
		const baseSelectQuery = this.db
			.select()
			.from(questionTable)
			.orderBy(orderBy)
			.limit(limit)
			.offset(offset);

		const baseCountQuery = this.db
			.select({ count: count() })
			.from(questionTable);

		// Execute queries with or without where clause
		// When hasConditions is true, whereCondition is guaranteed to be defined
		const [rows, countResult] = await Promise.all([
			hasConditions && whereCondition
				? baseSelectQuery.where(whereCondition)
				: baseSelectQuery,
			hasConditions && whereCondition
				? baseCountQuery.where(whereCondition)
				: baseCountQuery,
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

	async findRandomByTheme(
		themeId: string,
		limit: number,
		excludeIds: string[] = [],
	): Promise<QuestionWithAnswers[]> {
		// Build conditions
		const conditions = [
			eq(questionTable.themeId, themeId),
			eq(questionTable.validated, true),
		];

		// Add exclusion condition if there are IDs to exclude
		if (excludeIds.length > 0) {
			conditions.push(
				sql`${questionTable.id} NOT IN (${sql.join(
					excludeIds.map((id) => sql`${id}`),
					sql`, `,
				)})`,
			);
		}

		// Get random unique questions by theme
		const questionRows = await this.db
			.select()
			.from(questionTable)
			.where(and(...conditions))
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
