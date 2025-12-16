/**
 * Answer input for creating a question
 */
export interface CreateAnswerRequest {
	content: string;
	isCorrect: boolean;
}

/**
 * CreateQuestion Command Request
 */
export interface CreateQuestionRequest {
	content: string;
	explanation?: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	answers: CreateAnswerRequest[];
	tagIds?: string[];
}
