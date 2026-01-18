import { Elysia } from "elysia";
import { getUseCases } from "../composition";
import { createDifficultyRoutes } from "./difficulty.routes";
import { createQuestionRoute } from "./question.route";
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
	.use(
		createAdminQuestionRoutes(
			useCases.getQuestionById,
			useCases.getQuestions,
			useCases.setQuestionValidation,
			useCases.updateQuestion,
		),
	)
	.use(createDifficultyRoutes(useCases.getDifficulties))
	.use(createQuestionRoute(useCases.getRandomQuestion, useCases.validateAnswer))
	.use(createQuestionRoutes(useCases.createQuestion))
	.use(createThemeRoutes(useCases.getThemes));
