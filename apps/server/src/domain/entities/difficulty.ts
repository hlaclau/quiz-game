import { DomainError } from "../errors/domain.error";

/**
 * Difficulty Domain Entity
 * Represents a quiz difficulty level in the domain layer
 */
export interface DifficultyProps {
	id: string;
	name: string;
	level: number;
	color: string | null;
	createdAt: Date;
}

/**
 * Valid difficulty levels
 */
export const MIN_DIFFICULTY_LEVEL = 1;
export const MAX_DIFFICULTY_LEVEL = 5;

export class Difficulty {
	private constructor(private readonly props: DifficultyProps) {}

	static create(props: DifficultyProps): Difficulty {
		// Validate difficulty level
		if (
			props.level < MIN_DIFFICULTY_LEVEL ||
			props.level > MAX_DIFFICULTY_LEVEL
		) {
			throw new DomainError(
				`Difficulty level must be between ${MIN_DIFFICULTY_LEVEL} and ${MAX_DIFFICULTY_LEVEL}`,
			);
		}

		// Validate name
		if (props.name.trim().length === 0) {
			throw new DomainError("Difficulty name cannot be empty");
		}

		return new Difficulty(props);
	}

	/**
	 * Check if this difficulty is harder than another
	 */
	isHarderThan(other: Difficulty): boolean {
		return this.props.level > other.level;
	}

	/**
	 * Check if this difficulty is easier than another
	 */
	isEasierThan(other: Difficulty): boolean {
		return this.props.level < other.level;
	}

	/**
	 * Check if this difficulty is the same as another
	 */
	isSameAs(other: Difficulty): boolean {
		return this.props.level === other.level;
	}

	/**
	 * Get points multiplier based on difficulty
	 */
	getPointsMultiplier(): number {
		return this.props.level;
	}

	/**
	 * Check if this is the maximum difficulty
	 */
	isMaxDifficulty(): boolean {
		return this.props.level === MAX_DIFFICULTY_LEVEL;
	}

	/**
	 * Check if this is the minimum difficulty
	 */
	isMinDifficulty(): boolean {
		return this.props.level === MIN_DIFFICULTY_LEVEL;
	}

	/**
	 * Get the next difficulty level
	 */
	getNextLevel(): number | null {
		if (this.isMaxDifficulty()) {
			return null;
		}
		return this.props.level + 1;
	}

	/**
	 * Get the previous difficulty level
	 */
	getPreviousLevel(): number | null {
		if (this.isMinDifficulty()) {
			return null;
		}
		return this.props.level - 1;
	}

	// Getters
	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get level(): number {
		return this.props.level;
	}

	get color(): string | null {
		return this.props.color;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
}
