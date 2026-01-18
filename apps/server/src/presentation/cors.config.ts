import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

/**
 * CORS Configuration
 */
export const corsConfig = new Elysia().use(
	cors({
		origin: process.env.CORS_ORIGIN || "",
		methods: ["GET", "POST", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);
