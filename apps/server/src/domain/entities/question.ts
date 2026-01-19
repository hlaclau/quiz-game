import { DomainError, InvalidAnswersCountError } from "../errors/domain.error";
import type { Answer } from "./answer";
import type { Difficulty } from "./difficulty";

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

/**
 * Maximum age of a question in days before it's considered outdated
 */
export const MAX_QUESTION_AGE_DAYS = 365;

export class Question {
	private constructor(private readonly props: QuestionProps) {}

	static create(props: QuestionProps): Question {
		return new Question(props);
	}

	/**
	 * Validates that the answers count is exactly 4
	 * @throws InvalidAnswersCountError if the count is not 4
	 */
	static validateAnswersCount(answersCount: number): void {
		if (answersCount !== REQUIRED_ANSWERS_COUNT) {
			throw new InvalidAnswersCountError();
		}
	}

	/**
	 * Validate the question
	 * @throws DomainError if question is already validated
	 */
	markAsValidated(): Question {
		if (this.props.validated) {
			throw new DomainError("Question is already validated");
		}

		return new Question({
			...this.props,
			validated: true,
			updatedAt: new Date(),
		});
	}

	/**
	 * Reject/Invalidate the question
	 * @throws DomainError if question is not validated
	 */
	markAsRejected(): Question {
		if (!this.props.validated) {
			throw new DomainError("Cannot reject a non-validated question");
		}

		return new Question({
			...this.props,
			validated: false,
			updatedAt: new Date(),
		});
	}

	/**
	 * Check if the question can be modified
	 * A validated question cannot be modified
	 */
	canBeModified(): boolean {
		return !this.props.validated;
	}

	/**
	 * Check if the question can be deleted
	 * Only non-validated questions can be deleted
	 */
	canBeDeleted(): boolean {
		return !this.props.validated;
	}

	/**
	 * Check if an answer is the correct one
	 */
	checkAnswer(answerId: string, answers: Answer[]): boolean {
		const answer = answers.find((a) => a.id === answerId);
		if (!answer) {
			throw new DomainError("Answer not found");
		}
		return answer.isCorrect;
	}

	/**
	 * Calculate points for this question based on difficulty
	 */
	calculatePoints(difficulty: Difficulty): number {
		const basePoints = 10;
		const difficultyMultiplier = difficulty.level;
		return basePoints * difficultyMultiplier;
	}

	/**
	 * Calculate score with time bonus
	 */
	calculateScore(
		difficulty: Difficulty,
		timeSpentInSeconds: number,
		isCorrect: boolean,
	): number {
		if (!isCorrect) {
			return 0;
		}

		const basePoints = this.calculatePoints(difficulty);

		// Bonus de temps : plus on répond vite, plus on gagne de points
		const maxTimeBonus = basePoints * 0.5; // 50% de bonus max
		const maxTimeInSeconds = 60; // 1 minute max
		const timeBonus = Math.max(
			0,
			maxTimeBonus * (1 - timeSpentInSeconds / maxTimeInSeconds),
		);

		return Math.round(basePoints + timeBonus);
	}

	/**
	 * Check if the question is outdated (too old)
	 */
	isOutdated(maxAgeInDays: number = MAX_QUESTION_AGE_DAYS): boolean {
		const now = new Date();
		const ageInMs = now.getTime() - this.props.createdAt.getTime();
		const ageInDays = ageInMs / (1000 * 60 * 60 * 24);

		return ageInDays > maxAgeInDays;
	}

	/**
	 * Check if the question is authored by a specific user
	 */
	isAuthoredBy(authorId: string): boolean {
		return this.props.authorId === authorId;
	}

	/**
	 * Shuffle answers for display
	 */
	getShuffledAnswers(answers: Answer[]): Answer[] {
		return [...answers].sort(() => Math.random() - 0.5);
	}

	/**
	 * Update question content
	 * @throws DomainError if question is validated
	 */
	updateContent(
		content: string,
		explanation: string | null,
		difficultyId: string,
		themeId: string,
	): Question {
		if (!this.canBeModified()) {
			throw new DomainError("Cannot modify a validated question");
		}

		return new Question({
			...this.props,
			content,
			explanation,
			difficultyId,
			themeId,
			updatedAt: new Date(),
		});
	}

	// Getters
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
