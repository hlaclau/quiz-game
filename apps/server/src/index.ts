import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { auth } from "@quiz-game/auth";
import "dotenv/config";
import { Elysia } from "elysia";
import { routes } from "./presentation/router";

new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.use(
		swagger({
			provider: "scalar",
			path: "/docs",
			documentation: {
				info: {
					title: "Quiz Game API Documentation",
					version: "1.0.0",
					description:
						"An API documentation powered by Elysia and Scalar for the Quiz Game project",
				},
			},
		}),
	)
	.use(routes)
	.get("/", () => "OK")
	.get("/api/health", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
