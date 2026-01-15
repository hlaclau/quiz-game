import type { AnswerDTO } from "../../dtos/answer.dto";
import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Answer input for updating a question
 */
export interface UpdateAnswerInput {
	id?: string;
	content: string;
	isCorrect: boolean;
}

/**
 * Input for UpdateQuestion use case
 */
export interface UpdateQuestionInput {
	id: string;
	content: string;
	explanation?: string | null;
	difficultyId: string;
	themeId: string;
	answers: UpdateAnswerInput[];
	tagIds?: string[];
}

/**
 * Question with answers DTO
 */
export interface QuestionWithAnswersDTO extends QuestionDTO {
	answers: AnswerDTO[];
}

/**
 * Output for UpdateQuestion use case
 */
export interface UpdateQuestionOutput {
	data: QuestionWithAnswersDTO | null;
}
