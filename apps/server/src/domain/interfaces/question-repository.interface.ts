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
 * Question Repository Interface
 * Defines the contract for question data access
 */
export interface IQuestionRepository {
	create(input: CreateQuestionInput): Promise<Question>;
}
