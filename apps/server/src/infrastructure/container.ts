import { db } from "@quiz-game/db";
import { DrizzleThemeRepository } from "./repositories/theme.repository";

/**
 * All repository instances
 */
export const repositories = {
	theme: new DrizzleThemeRepository(db),
};
