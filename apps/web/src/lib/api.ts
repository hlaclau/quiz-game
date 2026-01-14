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
 * Answer DTO from API
 */
export interface AnswerDTO {
	id: string;
	content: string;
	isCorrect: boolean;
	createdAt: string;
}

/**
 * Question DTO from API
 */
export interface QuestionDTO {
	id: string;
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	validated: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Question with answers DTO from API
 */
export interface QuestionWithAnswersDTO extends QuestionDTO {
	answers: AnswerDTO[];
}

export type SortField = "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface GetQuestionsParams {
	page?: number;
	limit?: number;
	themeId?: string;
	validated?: boolean;
	sortBy?: SortField;
	sortOrder?: SortOrder;
}

export interface GetQuestionsResponse {
	data: QuestionDTO[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetQuestionByIdResponse {
	data: QuestionWithAnswersDTO | null;
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
	questions: {
		getAll: async (
			params: GetQuestionsParams = {},
		): Promise<GetQuestionsResponse> => {
			const searchParams = new URLSearchParams();
			if (params.page) searchParams.set("page", params.page.toString());
			if (params.limit) searchParams.set("limit", params.limit.toString());
			if (params.themeId) searchParams.set("themeId", params.themeId);
			if (params.validated !== undefined)
				searchParams.set("validated", params.validated.toString());
			if (params.sortBy) searchParams.set("sortBy", params.sortBy);
			if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

			const url = `${API_URL}/api/questions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Failed to fetch questions");
			}
			return response.json();
		},
		getById: async (id: string): Promise<GetQuestionByIdResponse> => {
			const response = await fetch(`${API_URL}/api/questions/${id}`);
			if (!response.ok) {
				if (response.status === 404) {
					return { data: null };
				}
				throw new Error("Failed to fetch question");
			}
			return response.json();
		},
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
		setValidation: async (
			id: string,
			validated: boolean,
		): Promise<QuestionDTO> => {
			const response = await fetch(
				`${API_URL}/api/questions/${id}/validation`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ validated }),
				},
			);
			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				throw new Error(error.error || "Failed to update question validation");
			}
			const result = await response.json();
			return result.data;
		},
	},
};
