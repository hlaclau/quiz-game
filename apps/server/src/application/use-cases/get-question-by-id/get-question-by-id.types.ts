import type { AnswerDTO } from "../../dtos/answer.dto";
import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Input for GetQuestionById use case
 */
export interface GetQuestionByIdInput {
	id: string;
}

/**
 * Question with answers DTO
 */
export interface QuestionWithAnswersDTO extends QuestionDTO {
	answers: AnswerDTO[];
}

/**
 * Output for GetQuestionById use case
 */
export interface GetQuestionByIdOutput {
	data: QuestionWithAnswersDTO | null;
}
