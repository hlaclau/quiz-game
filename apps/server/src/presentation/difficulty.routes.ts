import { Elysia } from "elysia";
import type { GetDifficultiesUseCase } from "../application/use-cases";

/**
 * Difficulty Routes
 */
export const createDifficultyRoutes = (
	getDifficultiesUseCase: GetDifficultiesUseCase,
) => {
	return new Elysia({ prefix: "/api/difficulties" }).get("/", () =>
		getDifficultiesUseCase.execute(),
	);
};
