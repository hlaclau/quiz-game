const API_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Theme DTO from API
 */
export interface ThemeDTO {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface GetThemesResponse {
	data: ThemeDTO[];
	count: number;
}

/**
 * Difficulty DTO from API
 */
export interface DifficultyDTO {
	id: string;
	name: string;
	level: number;
	color: string | null;
	createdAt: string;
}

export interface GetDifficultiesResponse {
	data: DifficultyDTO[];
	count: number;
}

/**
 * Answer input for creating a question
 */
export interface CreateAnswerInput {
	content: string;
	isCorrect: boolean;
}

/**
 * Create question request body
 */
export interface CreateQuestionInput {
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	answers: CreateAnswerInput[];
	tagIds?: string[];
}

/**
 * API client for themes
 */
export const api = {
	themes: {
		getAll: async (): Promise<GetThemesResponse> => {
			const response = await fetch(`${API_URL}/api/themes`);
			if (!response.ok) {
				throw new Error("Failed to fetch themes");
			}
			return response.json();
		},
	},
	difficulties: {
		getAll: async (): Promise<GetDifficultiesResponse> => {
			const response = await fetch(`${API_URL}/api/difficulties`);
			if (!response.ok) {
				throw new Error("Failed to fetch difficulties");
			}
			return response.json();
		},
	},
	//todo: fix error 500
	questions: {
		create: async (input: CreateQuestionInput): Promise<void> => {
			const response = await fetch(`${API_URL}/api/questions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.error || "Failed to create question");
			}
		},
	},
};
