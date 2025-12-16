import { eq, type Database } from "@quiz-game/db";
import { theme as themeTable } from "@quiz-game/db/schema/index";
import { Theme } from "../../domain/entities/theme";
import type { IThemeRepository } from "../../domain/interfaces/theme-repository.interface";

/**
 * Drizzle implementation of IThemeRepository
 */
export class DrizzleThemeRepository implements IThemeRepository {
	constructor(private readonly db: Database) {}

	async findAll(): Promise<Theme[]> {
		const rows = await this.db.select().from(themeTable);

		return rows.map((row) =>
			Theme.create({
				id: row.id,
				name: row.name,
				description: row.description,
				color: row.color,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
			}),
		);
	}

	async findById(id: string): Promise<Theme | null> {
		const rows = await this.db
			.select()
			.from(themeTable)
			.where(eq(themeTable.id, id))
			.limit(1);

		const row = rows[0];
		if (!row) return null;

		return Theme.create({
			id: row.id,
			name: row.name,
			description: row.description,
			color: row.color,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		});
	}
}
