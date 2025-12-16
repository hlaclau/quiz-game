import "dotenv/config";
import { auth } from "@quiz-game/auth";
import { Elysia } from "elysia";
import { routes } from "./presentation/router";

new Elysia()
	// .use(
	// 	cors({
	// 		origin: process.env.CORS_ORIGIN || "",
	// 		methods: ["GET", "POST", "OPTIONS"],
	// 		allowedHeaders: ["Content-Type", "Authorization"],
	// 		credentials: true,
	// 	}),
	// )
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.use(routes)
	.get("/", () => "OK")
	.get("/api/health", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
