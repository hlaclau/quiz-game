import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Answer input for creating a question
 */
export interface CreateAnswerInput {
	content: string;
	isCorrect: boolean;
}

/**
 * Input for CreateQuestion use case
 */
export interface CreateQuestionInput {
	content: string;
	explanation?: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	answers: CreateAnswerInput[];
	tagIds?: string[];
}

/**
 * Output for CreateQuestion use case
 */
export interface CreateQuestionOutput {
	data: QuestionDTO;
}
