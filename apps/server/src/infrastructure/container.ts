import { db } from "@quiz-game/db";
import { DrizzleQuestionRepository } from "./repositories/question.repository";
import { DrizzleThemeRepository } from "./repositories/theme.repository";

/**
 * All repository instances
 */
export const repositories = {
	theme: new DrizzleThemeRepository(db),
	question: new DrizzleQuestionRepository(db),
};
