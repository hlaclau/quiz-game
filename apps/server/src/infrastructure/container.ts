import { db } from "@quiz-game/db";
import { CreateQuestionHandler } from "../application/commands/create-question/create-question.handler";
import { GetDifficultiesHandler } from "../application/queries/get-difficulties/get-difficulties.handler";
import { GetThemesHandler } from "../application/queries/get-themes/get-themes.handler";
import { DrizzleDifficultyRepository } from "./repositories/difficulty.repository";
import { DrizzleQuestionRepository } from "./repositories/question.repository";
import { DrizzleThemeRepository } from "./repositories/theme.repository";

/**
 * All repository instances
 */
const repositories = {
	theme: new DrizzleThemeRepository(db),
	question: new DrizzleQuestionRepository(db),
	difficulty: new DrizzleDifficultyRepository(db),
};

/**
 * All use-case instances
 */
export const useCases = {
	createQuestion: new CreateQuestionHandler(repositories.question),
	getThemes: new GetThemesHandler(repositories.theme),
	getDifficulties: new GetDifficultiesHandler(repositories.difficulty),
};
