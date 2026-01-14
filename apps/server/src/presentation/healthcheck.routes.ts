import { Elysia } from "elysia";

/**
 * Healthcheck Routes
 */
export const healthcheck = new Elysia().get("/api/health", () => "OK");
