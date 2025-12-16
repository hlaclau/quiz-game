/**
 * Question DTO - Data Transfer Object for API responses
 */
export interface QuestionDTO {
	id: string;
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
}
