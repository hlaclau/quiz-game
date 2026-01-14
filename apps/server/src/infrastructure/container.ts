import { db } from "@quiz-game/db";
import {
	CreateQuestionUseCase,
	GetDifficultiesUseCase,
	GetThemesUseCase,
} from "../application/use-cases";
import { DrizzleDifficultyRepository } from "./repositories/difficulty.repository";
import { DrizzleQuestionRepository } from "./repositories/question.repository";
import { DrizzleThemeRepository } from "./repositories/theme.repository";

/**
 * Repository instances
 */
const repositories = {
	theme: new DrizzleThemeRepository(db),
	question: new DrizzleQuestionRepository(db),
	difficulty: new DrizzleDifficultyRepository(db),
};

/**
 * Use case instances
 */
export const useCases = {
	createQuestion: new CreateQuestionUseCase(repositories.question),
	getThemes: new GetThemesUseCase(repositories.theme),
	getDifficulties: new GetDifficultiesUseCase(repositories.difficulty),
};
