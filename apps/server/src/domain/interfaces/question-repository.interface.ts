import type { Answer } from "../entities/answer";
import type { Question } from "../entities/question";

/**
 * Answer Input for creating a question
 */
export interface CreateAnswerInput {
	content: string;
	isCorrect: boolean;
}

/**
 * Create Question Input
 */
export interface CreateQuestionInput {
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	answers: CreateAnswerInput[];
	tagIds?: string[];
}

/**
 * Answer Input for updating a question
 */
export interface UpdateAnswerInput {
	id?: string;
	content: string;
	isCorrect: boolean;
}

/**
 * Update Question Input
 */
export interface UpdateQuestionInput {
	id: string;
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	answers: UpdateAnswerInput[];
	tagIds?: string[];
}

/**
 * Filter options for finding questions
 */
export interface FindQuestionsFilter {
	themeId?: string;
	validated?: boolean;
}

/**
 * Sort options for finding questions
 */
export type SortField = "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface SortOptions {
	sortBy?: SortField;
	sortOrder?: SortOrder;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
	page: number;
	limit: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
	data: T[];
	total: number;
}

/**
 * Question with its answers
 */
export interface QuestionWithAnswers {
	question: Question;
	answers: Answer[];
}

/**
 * Question Repository Interface
 * Defines the contract for question data access
 */
export interface IQuestionRepository {
	create(input: CreateQuestionInput): Promise<Question>;
	update(input: UpdateQuestionInput): Promise<QuestionWithAnswers | null>;
	findById(id: string): Promise<QuestionWithAnswers | null>;
	findAll(
		filter: FindQuestionsFilter,
		pagination: PaginationOptions,
		sort?: SortOptions,
	): Promise<PaginatedResult<Question>>;
	setQuestionValidation(
		id: string,
		validated: boolean,
	): Promise<Question | null>;
	findRandomByTheme(
		themeId: string,
		limit: number,
		excludeIds?: string[],
	): Promise<QuestionWithAnswers[]>;
}
