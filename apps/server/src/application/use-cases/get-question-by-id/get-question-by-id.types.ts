import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Input for GetQuestionById use case
 */
export interface GetQuestionByIdInput {
	id: string;
}

/**
 * Output for GetQuestionById use case
 */
export interface GetQuestionByIdOutput {
	data: QuestionDTO | null;
}
