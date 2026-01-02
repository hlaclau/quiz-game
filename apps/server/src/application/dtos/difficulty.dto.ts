/**
 * Difficulty DTO - Data Transfer Object for API responses
 */
export interface DifficultyDTO {
	id: string;
	name: string;
	level: number;
	color: string | null;
	createdAt: string;
}
