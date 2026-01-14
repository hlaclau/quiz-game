import { Elysia } from "elysia";
import { useCases } from "../infrastructure/container";
import { createDifficultyRoutes } from "./difficulty.routes";
import { createQuestionRoute } from "./question.route";
import { createQuestionRoutes } from "./question.routes";
import { createThemeRoutes } from "./theme.routes";

/**
 * All application routes
 */
export const routes = new Elysia()
	.use(createThemeRoutes(useCases.getThemes))
	.use(
		createQuestionRoutes(
			useCases.createQuestion,
			useCases.getQuestionById,
			useCases.getQuestions,
		),
	)
	.use(createQuestionRoute(useCases.getRandomQuestions))
	.use(createDifficultyRoutes(useCases.getDifficulties));
