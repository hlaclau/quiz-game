import { Elysia } from "elysia";
import type { GetThemesHandler } from "../application/queries/get-themes/get-themes.handler";

/**
 * Theme Routes
 */
export const createThemeRoutes = (getThemesHandler: GetThemesHandler) => {
	return new Elysia({ prefix: "/api/themes" }).get("/", () =>
		getThemesHandler.execute(),
	);
};
