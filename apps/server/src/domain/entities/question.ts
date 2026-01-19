import { InvalidAnswersCountError } from "../errors/domain.error";

/**
 * Question Domain Entity
 * Represents a quiz question in the domain layer
 */
export interface QuestionProps {
	id: string;
	content: string;
	explanation: string | null;
	difficultyId: string;
	themeId: string;
	authorId: string;
	validated: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Required number of answers for a question
 */
export const REQUIRED_ANSWERS_COUNT = 4;

export class Question {
	private constructor(private readonly props: QuestionProps) {}

	static create(props: QuestionProps): Question {
		return new Question(props);
	}

	/**
	 * Validates that the answers count is exactly 4
	 * @deprecated Use QuestionValidationService.validateAnswersCount instead
	 * @throws InvalidAnswersCountError if the count is not 4
	 */
	static validateAnswersCount(answersCount: number): void {
		if (answersCount !== REQUIRED_ANSWERS_COUNT) {
			throw new InvalidAnswersCountError();
		}
	}

	get id(): string {
		return this.props.id;
	}

	get content(): string {
		return this.props.content;
	}

	get explanation(): string | null {
		return this.props.explanation;
	}

	get difficultyId(): string {
		return this.props.difficultyId;
	}

	get themeId(): string {
		return this.props.themeId;
	}

	get authorId(): string {
		return this.props.authorId;
	}

	get validated(): boolean {
		return this.props.validated;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
