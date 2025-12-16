/**
 * Theme Domain Entity
 * Represents a quiz theme/category in the domain layer
 */
export interface ThemeProps {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export class Theme {
	private constructor(private readonly props: ThemeProps) {}

	static create(props: ThemeProps): Theme {
		return new Theme(props);
	}

	get id(): string {
		return this.props.id;
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string | null {
		return this.props.description;
	}

	get color(): string | null {
		return this.props.color;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
