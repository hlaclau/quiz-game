import { Elysia } from "elysia";
import { repositories } from "../infrastructure/container";
import { createQuestionRoutes } from "./question.routes";
import { createThemeRoutes } from "./theme.routes";

/**
 * All application routes
 */
export const routes = new Elysia()
	.use(createThemeRoutes(repositories.theme))
	.use(createQuestionRoutes(repositories.question));
