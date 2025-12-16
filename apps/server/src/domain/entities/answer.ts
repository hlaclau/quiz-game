/**
 * Answer Domain Entity
 * Represents a quiz answer in the domain layer
 */
export interface AnswerProps {
	id: string;
	content: string;
	isCorrect: boolean;
	questionId: string;
	createdAt: Date;
}

export class Answer {
	private constructor(private readonly props: AnswerProps) {}

	static create(props: AnswerProps): Answer {
		return new Answer(props);
	}

	get id(): string {
		return this.props.id;
	}

	get content(): string {
		return this.props.content;
	}

	get isCorrect(): boolean {
		return this.props.isCorrect;
	}

	get questionId(): string {
		return this.props.questionId;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}
}
