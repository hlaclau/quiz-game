import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL || "");

export type Database = typeof db;

// Re-export drizzle utilities to avoid version conflicts in monorepo
export { eq, and, or, desc, asc, sql } from "drizzle-orm";
