import { Elysia } from "elysia";
import { getUseCases } from "../composition";
import { createDifficultyRoutes } from "./difficulty.routes";
import {
	createAdminQuestionRoutes,
	createQuestionRoutes,
} from "./question.routes";
import { createThemeRoutes } from "./theme.routes";

/**
 * All application routes
 */
const useCases = getUseCases();

export const routes = new Elysia()
	.use(createThemeRoutes(useCases.getThemes))
	.use(createQuestionRoutes(useCases.createQuestion))
	.use(
		createAdminQuestionRoutes(
			useCases.getQuestionById,
			useCases.getQuestions,
			useCases.setQuestionValidation,
			useCases.updateQuestion,
		),
	)
	.use(createQuestionRoute(useCases.getRandomQuestions))
	.use(createDifficultyRoutes(useCases.getDifficulties));
