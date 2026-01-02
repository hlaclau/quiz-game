import type { Difficulty } from "../entities/difficulty";

/**
 * Difficulty Repository Interface
 * Defines the contract for difficulty data access
 */
export interface IDifficultyRepository {
	findAll(): Promise<Difficulty[]>;
	findById(id: string): Promise<Difficulty | null>;
}
