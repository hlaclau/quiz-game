import type { AnswerDTO } from "../../dtos/answer.dto";
import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Input for GetRandomQuestions use case
 */
export interface GetRandomQuestionsInput {
	themeId: string;
	limit: number;
}

/**
 * Question with answers DTO
 */
export interface QuestionWithAnswersDTO extends QuestionDTO {
	answers: AnswerDTO[];
}

/**
 * Output for GetRandomQuestions use case
 */
export interface GetRandomQuestionsOutput {
	data: QuestionWithAnswersDTO[];
}
