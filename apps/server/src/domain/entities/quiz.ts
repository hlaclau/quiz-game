import { DomainError } from "../errors/domain.error";
import type { Question } from "./question";

/**
 * Quiz Domain Entity (Aggregate Root)
 * Represents a collection of questions forming a quiz
 */
export interface QuizProps {
	id: string;
	name: string;
	description: string | null;
	themeId: string;
	difficultyId: string;
	questionIds: string[];
	isPublished: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Quiz constraints
 */
export const MIN_QUIZ_QUESTIONS = 5;
export const MAX_QUIZ_QUESTIONS = 20;
export const MIN_QUIZ_NAME_LENGTH = 3;
export const MAX_QUIZ_NAME_LENGTH = 100;

export class Quiz {
	private constructor(private readonly props: QuizProps) {}

	/**
	 * Create a new quiz from questions
	 */
	static create(
		name: string,
		description: string | null,
		themeId: string,
		difficultyId: string,
		questions: Question[],
	): Quiz {
		// Validate name
		if (name.trim().length < MIN_QUIZ_NAME_LENGTH) {
			throw new DomainError(
				`Quiz name must be at least ${MIN_QUIZ_NAME_LENGTH} characters`,
			);
		}

		if (name.trim().length > MAX_QUIZ_NAME_LENGTH) {
			throw new DomainError(
				`Quiz name must not exceed ${MAX_QUIZ_NAME_LENGTH} characters`,
			);
		}

		// Validate question count
		if (questions.length < MIN_QUIZ_QUESTIONS) {
			throw new DomainError(
				`A quiz must have at least ${MIN_QUIZ_QUESTIONS} questions`,
			);
		}

		if (questions.length > MAX_QUIZ_QUESTIONS) {
			throw new DomainError(
				`A quiz cannot have more than ${MAX_QUIZ_QUESTIONS} questions`,
			);
		}

		// All questions must be validated
		if (questions.some((q) => !q.validated)) {
			throw new DomainError("All questions in a quiz must be validated");
		}

		// All questions must belong to the same theme
		if (questions.some((q) => q.themeId !== themeId)) {
			throw new DomainError("All questions must belong to the same theme");
		}

		// All questions must have the same difficulty
		if (questions.some((q) => q.difficultyId !== difficultyId)) {
			throw new DomainError("All questions must have the same difficulty");
		}

		return new Quiz({
			id: crypto.randomUUID(),
			name: name.trim(),
			description: description?.trim() || null,
			themeId,
			difficultyId,
			questionIds: questions.map((q) => q.id),
			isPublished: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	/**
	 * Create quiz from props (for repository reconstruction)
	 */
	static fromProps(props: QuizProps): Quiz {
		return new Quiz(props);
	}

	/**
	 * Add a question to the quiz
	 */
	addQuestion(question: Question): Quiz {
		if (this.props.isPublished) {
			throw new DomainError("Cannot modify a published quiz");
		}

		if (this.props.questionIds.length >= MAX_QUIZ_QUESTIONS) {
			throw new DomainError(
				`Cannot add more than ${MAX_QUIZ_QUESTIONS} questions to a quiz`,
			);
		}

		if (question.themeId !== this.props.themeId) {
			throw new DomainError("Question theme must match quiz theme");
		}

		if (question.difficultyId !== this.props.difficultyId) {
			throw new DomainError("Question difficulty must match quiz difficulty");
		}

		if (!question.validated) {
			throw new DomainError("Cannot add non-validated question to quiz");
		}

		if (this.props.questionIds.includes(question.id)) {
			throw new DomainError("Question already exists in quiz");
		}

		return new Quiz({
			...this.props,
			questionIds: [...this.props.questionIds, question.id],
			updatedAt: new Date(),
		});
	}

	/**
	 * Remove a question from the quiz
	 */
	removeQuestion(questionId: string): Quiz {
		if (this.props.isPublished) {
			throw new DomainError("Cannot modify a published quiz");
		}

		if (!this.props.questionIds.includes(questionId)) {
			throw new DomainError("Question not found in quiz");
		}

		if (this.props.questionIds.length <= MIN_QUIZ_QUESTIONS) {
			throw new DomainError(
				`Cannot remove question: minimum ${MIN_QUIZ_QUESTIONS} questions required`,
			);
		}

		return new Quiz({
			...this.props,
			questionIds: this.props.questionIds.filter((id) => id !== questionId),
			updatedAt: new Date(),
		});
	}

	/**
	 * Publish the quiz (make it available to users)
	 */
	publish(): Quiz {
		if (this.props.isPublished) {
			throw new DomainError("Quiz is already published");
		}

		if (this.props.questionIds.length < MIN_QUIZ_QUESTIONS) {
			throw new DomainError(
				`Cannot publish quiz with less than ${MIN_QUIZ_QUESTIONS} questions`,
			);
		}

		return new Quiz({
			...this.props,
			isPublished: true,
			updatedAt: new Date(),
		});
	}

	/**
	 * Unpublish the quiz
	 */
	unpublish(): Quiz {
		if (!this.props.isPublished) {
			throw new DomainError("Quiz is not published");
		}

		return new Quiz({
			...this.props,
			isPublished: false,
			updatedAt: new Date(),
		});
	}

	/**
	 * Update quiz metadata
	 */
	updateMetadata(name: string, description: string | null): Quiz {
		if (this.props.isPublished) {
			throw new DomainError("Cannot modify metadata of a published quiz");
		}

		if (name.trim().length < MIN_QUIZ_NAME_LENGTH) {
			throw new DomainError(
				`Quiz name must be at least ${MIN_QUIZ_NAME_LENGTH} characters`,
			);
		}

		if (name.trim().length > MAX_QUIZ_NAME_LENGTH) {
			throw new DomainError(
				`Quiz name must not exceed ${MAX_QUIZ_NAME_LENGTH} characters`,
			);
		}

		return new Quiz({
			...this.props,
			name: name.trim(),
			description: description?.trim() || null,
			updatedAt: new Date(),
		});
	}

	/**
	 * Check if quiz can be modified
	 */
	canBeModified(): boolean {
		return !this.props.isPublished;
	}

	/**
	 * Get estimated duration in seconds
	 */
	getEstimatedDuration(): number {
		// Average 45 seconds per question
		return this.props.questionIds.length * 45;
	}

	/**
	 * Get question count
	 */
	getQuestionCount(): number {
		return this.props.questionIds.length;
	}

	/**
	 * Check if quiz contains a specific question
	 */
	hasQuestion(questionId: string): boolean {
		return this.props.questionIds.includes(questionId);
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

	get themeId(): string {
		return this.props.themeId;
	}

	get difficultyId(): string {
		return this.props.difficultyId;
	}

	get questionIds(): readonly string[] {
		return [...this.props.questionIds];
	}

	get isPublished(): boolean {
		return this.props.isPublished;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}
}
