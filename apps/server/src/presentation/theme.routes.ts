import { Elysia } from "elysia";
import { GetThemesHandler } from "../application/queries/get-themes/get-themes.handler";
import type { IThemeRepository } from "../domain/interfaces/theme-repository.interface";

/**
 * Theme Routes
 */
export const createThemeRoutes = (themeRepository: IThemeRepository) => {
	const getThemesHandler = new GetThemesHandler(themeRepository);

	return new Elysia({ prefix: "/api/themes" }).get("/", () =>
		getThemesHandler.execute(),
	);
};
