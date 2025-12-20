import { Elysia } from "elysia";
import { GetDifficultiesHandler } from "../application/queries/get-difficulties/get-difficulties.handler";
import type { IDifficultyRepository } from "../domain/interfaces/difficulty-repository.interface";

/**
 * Difficulty Routes
 */
export const createDifficultyRoutes = (
	difficultyRepository: IDifficultyRepository,
) => {
	const getDifficultiesHandler = new GetDifficultiesHandler(
		difficultyRepository,
	);

	return new Elysia({ prefix: "/api/difficulties" }).get("/", () =>
		getDifficultiesHandler.execute(),
	);
};
