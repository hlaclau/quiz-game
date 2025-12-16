import type { Theme } from "../entities/theme";

/**
 * Theme Repository Interface
 * Defines the contract for theme data access
 */
export interface IThemeRepository {
	findAll(): Promise<Theme[]>;
	findById(id: string): Promise<Theme | null>;
}
