import { Elysia } from "elysia";
import type { GetThemesUseCase } from "../application/use-cases";

/**
 * Theme Routes
 */
export const createThemeRoutes = (getThemesUseCase: GetThemesUseCase) => {
	return new Elysia({ prefix: "/api/themes" }).get("/", () =>
		getThemesUseCase.execute(),
	);
};
