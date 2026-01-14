import { swagger } from "@elysiajs/swagger";
import "dotenv/config";
import { Elysia } from "elysia";
import { authRoute } from "./presentation/auth.routes";
import { corsConfig } from "./presentation/cors.config";
import { healthcheck } from "./presentation/healthcheck.routes";
import { routes } from "./presentation/router";

new Elysia()
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
	.use(corsConfig)
	.use(healthcheck)
	.use(authRoute)
	.use(routes)
	.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
