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
};
