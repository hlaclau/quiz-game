import { auth } from "@quiz-game/auth";
import { Elysia } from "elysia";

/**
 * Auth Routes
 */
export const authRoute = new Elysia().all("/api/auth/*", async (context) => {
	const { request, status } = context;
	if (["POST", "GET"].includes(request.method)) {
		return auth.handler(request);
	}
	return status(405);
});
