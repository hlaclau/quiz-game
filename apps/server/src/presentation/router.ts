import { Elysia } from "elysia";
import { repositories } from "../infrastructure/container";
import { createThemeRoutes } from "./theme.routes";

/**
 * All application routes
 */
export const routes = new Elysia().use(createThemeRoutes(repositories.theme));
