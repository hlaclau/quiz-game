import { createMiddleware } from "@tanstack/react-start";
import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		try {
			const { data: session } = await authClient.getSession({
				fetchOptions: {
					headers: request.headers,
				},
			});
			return next({
				context: { session },
			});
		} catch {
			return next({
				context: { session: null },
			});
		}
	},
);
