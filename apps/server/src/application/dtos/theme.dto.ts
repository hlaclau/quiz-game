/**
 * Theme DTO - Data Transfer Object for API responses
 */
export interface ThemeDTO {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	createdAt: string;
	updatedAt: string;
}
