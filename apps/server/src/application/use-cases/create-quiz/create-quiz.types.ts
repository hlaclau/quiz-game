/**
 * Input for creating a quiz
 */
export interface CreateQuizInput {
	name: string;
	description: string | null;
	themeId: string;
	difficultyId: string;
	questionIds: string[];
}

/**
 * Quiz DTO for output
 */
export interface QuizDTO {
	id: string;
	name: string;
	description: string | null;
	themeId: string;
	difficultyId: string;
	questionIds: string[];
	questionCount: number;
	estimatedDuration: number;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Output for creating a quiz
 */
export interface CreateQuizOutput {
	data: QuizDTO;
}
