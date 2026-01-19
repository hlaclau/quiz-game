import { DomainError } from "../errors/domain.error";

/**
 * DifficultyLevel Value Object
 * Encapsulates difficulty level with validation and business rules
 */
export class DifficultyLevel {
	private constructor(
		private readonly level: number,
		private readonly name: string,
	) {}

	static create(level: number, name: string): DifficultyLevel {
		if (level < 1 || level > 5) {
			throw new DomainError("Difficulty level must be between 1 and 5");
		}

		const trimmedName = name.trim();
		if (trimmedName.length === 0) {
			throw new DomainError("Difficulty name cannot be empty");
		}

		return new DifficultyLevel(level, trimmedName);
	}

	getLevel(): number {
		return this.level;
	}

	getName(): string {
		return this.name;
	}

	isHarderThan(other: DifficultyLevel): boolean {
		return this.level > other.level;
	}

	isEasierThan(other: DifficultyLevel): boolean {
		return this.level < other.level;
	}

	isSameAs(other: DifficultyLevel): boolean {
		return this.level === other.level;
	}

	/**
	 * Calculate points multiplier based on difficulty
	 */
	getPointsMultiplier(): number {
		return this.level;
	}

	/**
	 * Check if this is the maximum difficulty
	 */
	isMaxDifficulty(): boolean {
		return this.level === 5;
	}

	/**
	 * Check if this is the minimum difficulty
	 */
	isMinDifficulty(): boolean {
		return this.level === 1;
	}
}
