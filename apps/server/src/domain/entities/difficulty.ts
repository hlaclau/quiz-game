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

export class Difficulty {
	private constructor(private readonly props: DifficultyProps) {}

	static create(props: DifficultyProps): Difficulty {
		return new Difficulty(props);
	}

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
