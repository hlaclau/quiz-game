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
 * Filter options for finding questions
 */
export interface FindQuestionsFilter {
	themeId?: string;
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
	findById(id: string): Promise<QuestionWithAnswers | null>;
	findAll(
		filter: FindQuestionsFilter,
		pagination: PaginationOptions,
	): Promise<PaginatedResult<Question>>;
}
