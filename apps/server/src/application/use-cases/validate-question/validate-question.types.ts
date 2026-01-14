import type { QuestionDTO } from "../../dtos/question.dto";

/**
 * Input for SetQuestionValidation use case
 */
export interface SetQuestionValidationInput {
	id: string;
	validated: boolean;
}

/**
 * Output for SetQuestionValidation use case
 */
export interface SetQuestionValidationOutput {
	data: QuestionDTO | null;
}
