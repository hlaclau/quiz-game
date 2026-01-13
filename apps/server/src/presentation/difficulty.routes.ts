import { Elysia } from "elysia";
import type { GetDifficultiesHandler } from "../application/queries/get-difficulties/get-difficulties.handler";

/**
 * Difficulty Routes
 */
export const createDifficultyRoutes = (
	getDifficultiesHandler: GetDifficultiesHandler,
) => {
	return new Elysia({ prefix: "/api/difficulties" }).get("/", () =>
		getDifficultiesHandler.execute(),
	);
};
