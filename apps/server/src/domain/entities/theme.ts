import { DomainError } from "../errors/domain.error";

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

/**
 * Default colors for themes
 */
const DEFAULT_THEME_COLORS = [
	"#3B82F6", // Blue
	"#10B981", // Green
	"#F59E0B", // Orange
	"#EF4444", // Red
	"#8B5CF6", // Purple
	"#06B6D4", // Cyan
	"#F97316", // Orange-Red
	"#84CC16", // Lime
];

/**
 * Minimum question count to be considered popular
 */
export const POPULAR_THEME_MIN_QUESTIONS = 50;

export class Theme {
	private constructor(private readonly props: ThemeProps) {}

	static create(props: ThemeProps): Theme {
		// Valider le nom du thème
		if (props.name.trim().length < 2) {
			throw new DomainError("Theme name must be at least 2 characters");
		}

		if (props.name.trim().length > 100) {
			throw new DomainError("Theme name must not exceed 100 characters");
		}

		return new Theme(props);
	}

	/**
	 * Check if the theme is popular based on question count
	 */
	isPopular(questionCount: number): boolean {
		return questionCount >= POPULAR_THEME_MIN_QUESTIONS;
	}

	/**
	 * Get the display color (with fallback to generated color)
	 */
	getDisplayColor(): string {
		return this.props.color ?? this.generateDefaultColor();
	}

	/**
	 * Generate a default color based on theme name hash
	 */
	private generateDefaultColor(): string {
		const hash = this.props.name.split("").reduce((acc, char) => {
			return acc + char.charCodeAt(0);
		}, 0);
		return DEFAULT_THEME_COLORS[hash % DEFAULT_THEME_COLORS.length];
	}

	/**
	 * Check if theme has a custom color set
	 */
	hasCustomColor(): boolean {
		return this.props.color !== null;
	}

	/**
	 * Check if theme name matches a search query
	 */
	matchesSearch(query: string): boolean {
		const normalizedQuery = query.toLowerCase().trim();
		const normalizedName = this.props.name.toLowerCase();
		const normalizedDescription = this.props.description?.toLowerCase() ?? "";

		return (
			normalizedName.includes(normalizedQuery) ||
			normalizedDescription.includes(normalizedQuery)
		);
	}

	/**
	 * Get a short description for display (truncated if too long)
	 */
	getShortDescription(maxLength = 100): string | null {
		if (!this.props.description) {
			return null;
		}

		if (this.props.description.length <= maxLength) {
			return this.props.description;
		}

		return `${this.props.description.substring(0, maxLength)}...`;
	}

	// Getters
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
