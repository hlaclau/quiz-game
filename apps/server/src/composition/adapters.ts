import { db } from "@quiz-game/db";
import type { IDifficultyRepository } from "../domain/interfaces/difficulty-repository.interface";
import type { IQuestionRepository } from "../domain/interfaces/question-repository.interface";
import type { IThemeRepository } from "../domain/interfaces/theme-repository.interface";
import { DrizzleDifficultyRepository } from "../infrastructure/repositories/difficulty.repository";
import { DrizzleQuestionRepository } from "../infrastructure/repositories/question.repository";
import { DrizzleThemeRepository } from "../infrastructure/repositories/theme.repository";

/**
 * Repository Adapters
 * Provides factory functions for creating repository instances
 * This abstraction allows easy swapping of implementations (e.g., for testing)
 */

/**
 * Create a theme repository instance
 */
export const createThemeRepository = (): IThemeRepository => {
	return new DrizzleThemeRepository(db);
};

/**
 * Create a question repository instance
 */
export const createQuestionRepository = (): IQuestionRepository => {
	return new DrizzleQuestionRepository(db);
};

/**
 * Create a difficulty repository instance
 */
export const createDifficultyRepository = (): IDifficultyRepository => {
	return new DrizzleDifficultyRepository(db);
};
