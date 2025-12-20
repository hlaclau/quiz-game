import { type Database, eq } from "@quiz-game/db";
import { difficulty as difficultyTable } from "@quiz-game/db/schema/index";
import { Difficulty } from "../../domain/entities/difficulty";
import type { IDifficultyRepository } from "../../domain/interfaces/difficulty-repository.interface";

/**
 * Drizzle implementation of IDifficultyRepository
 */
export class DrizzleDifficultyRepository implements IDifficultyRepository {
	constructor(private readonly db: Database) {}

	async findAll(): Promise<Difficulty[]> {
		const rows = await this.db.select().from(difficultyTable);

		return rows.map((row) =>
			Difficulty.create({
				id: row.id,
				name: row.name,
				level: row.level,
				color: row.color,
				createdAt: row.createdAt,
			}),
		);
	}

	async findById(id: string): Promise<Difficulty | null> {
		const rows = await this.db
			.select()
			.from(difficultyTable)
			.where(eq(difficultyTable.id, id))
			.limit(1);

		const row = rows[0];
		if (!row) return null;

		return Difficulty.create({
			id: row.id,
			name: row.name,
			level: row.level,
			color: row.color,
			createdAt: row.createdAt,
		});
	}
}
