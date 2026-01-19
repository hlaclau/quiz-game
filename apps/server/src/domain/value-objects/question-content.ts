import { ContentTooLongError, EmptyContentError } from "../errors/domain.error";

/**
 * Maximum length for question content
 */
export const QUESTION_CONTENT_MAX_LENGTH = 500;

/**
 * QuestionContent Value Object
 * Encapsulates and validates question text content
 */
interface QuestionContentProps {
	value: string;
}

export class QuestionContent {
	private constructor(private readonly props: QuestionContentProps) {}

	/**
	 * Factory method to create a validated QuestionContent
	 * @throws EmptyContentError if content is empty or whitespace-only
	 * @throws ContentTooLongError if content exceeds max length
	 */
	static create(content: string): QuestionContent {
		const trimmed = content.trim();

		if (!trimmed || trimmed.length === 0) {
			throw new EmptyContentError("Question content");
		}

		if (trimmed.length > QUESTION_CONTENT_MAX_LENGTH) {
			throw new ContentTooLongError(
				"Question content",
				QUESTION_CONTENT_MAX_LENGTH,
			);
		}

		return new QuestionContent({ value: trimmed });
	}

	/**
	 * Returns the content value
	 */
	get value(): string {
		return this.props.value;
	}

	/**
	 * Returns the length of the content
	 */
	get length(): number {
		return this.props.value.length;
	}

	/**
	 * Equality comparison
	 */
	equals(other: QuestionContent): boolean {
		return this.props.value === other.props.value;
	}
}
