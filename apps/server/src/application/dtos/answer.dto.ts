/**
 * Answer DTO - Data Transfer Object for API responses
 */
export interface AnswerDTO {
	id: string;
	content: string;
	isCorrect?: boolean;
	createdAt: string;
}
