import { db } from "@quiz-game/db";
import * as schema from "@quiz-game/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID || "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
		},
	},
	plugins: [
		username({
			minUsernameLength: 3,
			maxUsernameLength: 20,
			usernameValidator: (value) => {
				// Only allow alphanumeric characters and underscores, no spaces or special chars
				return /^[a-zA-Z0-9_]+$/.test(value);
			},
		}),
	],
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
