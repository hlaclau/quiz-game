import { REQUIRED_ANSWERS_COUNT } from "../entities/question";
import {
	DuplicateAnswersError,
	EmptyAnswerContentError,
	InvalidAnswersCountError,
	InvalidCorrectAnswersCountError,
} from "../errors/domain.error";
import {
	QUESTION_CONTENT_MAX_LENGTH,
	QuestionContent,
} from "../value-objects/question-content";

/**
 * Sanitizes content by trimming and normalizing whitespace
 */
function sanitizeContent(content: string): string {
	return content.trim().replace(/\s+/g, " ");
}

/**
 * Normalizes content for comparison (lowercase, sanitized)
 */
function normalizeForComparison(content: string): string {
	return sanitizeContent(content).toLowerCase();
}

/**
 * Answer input for validation (does not require full Answer entity)
 */
export interface AnswerValidationInput {
	content: string;
	isCorrect: boolean;
}

/**
 * Question input for validation
 */
export interface QuestionValidationInput {
	content: string;
	answers: AnswerValidationInput[];
}

/**
 * Validation result containing success status and any errors
 */
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

/**
 * QuestionValidationService Domain Service
 * Centralizes all question validation rules in the domain layer
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Domain service pattern
export class QuestionValidationService {
	/**
	 * Validates a complete question with answers
	 * Throws domain errors for any validation failures (fail-fast)
	 * @throws InvalidAnswersCountError if not exactly 4 answers
	 * @throws InvalidCorrectAnswersCountError if not exactly 1 correct answer
	 * @throws EmptyAnswerContentError if any answer has empty content
	 * @throws DuplicateAnswersError if any answers have the same content
	 * @throws EmptyContentError if question content is empty
	 * @throws ContentTooLongError if question content exceeds max length
	 */
	static validate(input: QuestionValidationInput): void {
		// Validate question content using value object (sanitizes internally)
		QuestionContent.create(input.content);

		// Validate answers count (exactly 4)
		QuestionValidationService.validateAnswersCount(input.answers.length);

		// Validate exactly one correct answer
		QuestionValidationService.validateCorrectAnswersCount(input.answers);

		// Validate all answers have non-empty content
		QuestionValidationService.validateAnswersContent(input.answers);

		// Validate all answers are unique
		QuestionValidationService.validateUniqueAnswers(input.answers);
	}

	/**
	 * Validates answers count is exactly 4
	 * @throws InvalidAnswersCountError if count !== 4
	 */
	static validateAnswersCount(count: number): void {
		if (count !== REQUIRED_ANSWERS_COUNT) {
			throw new InvalidAnswersCountError();
		}
	}

	/**
	 * Validates exactly one answer is marked as correct
	 * @throws InvalidCorrectAnswersCountError if not exactly 1 correct answer
	 */
	static validateCorrectAnswersCount(answers: AnswerValidationInput[]): void {
		const correctAnswersCount = answers.filter((a) => a.isCorrect).length;
		if (correctAnswersCount !== 1) {
			throw new InvalidCorrectAnswersCountError();
		}
	}

	/**
	 * Validates all answers have non-empty content
	 * @throws EmptyAnswerContentError if any answer has empty/whitespace content
	 */
	static validateAnswersContent(answers: AnswerValidationInput[]): void {
		const hasEmptyContent = answers.some(
			(a) => !a.content || sanitizeContent(a.content).length === 0,
		);
		if (hasEmptyContent) {
			throw new EmptyAnswerContentError();
		}
	}

	/**
	 * Validates all answers are unique (case-insensitive comparison)
	 * @throws DuplicateAnswersError if two or more answers have the same content
	 */
	static validateUniqueAnswers(answers: AnswerValidationInput[]): void {
		const normalizedAnswers = answers.map((a) =>
			normalizeForComparison(a.content),
		);
		const uniqueAnswers = new Set(normalizedAnswers);
		if (uniqueAnswers.size !== normalizedAnswers.length) {
			throw new DuplicateAnswersError();
		}
	}

	/**
	 * Non-throwing validation that returns a result object
	 * Useful when you want to collect all errors rather than fail-fast
	 */
	static validateWithResult(input: QuestionValidationInput): ValidationResult {
		const errors: string[] = [];

		// Validate question content (sanitized)
		const sanitizedContent = sanitizeContent(input.content ?? "");
		if (!sanitizedContent) {
			errors.push("Question content cannot be empty");
		} else if (sanitizedContent.length > QUESTION_CONTENT_MAX_LENGTH) {
			errors.push(
				`Question content cannot exceed ${QUESTION_CONTENT_MAX_LENGTH} characters`,
			);
		}

		// Validate answers count
		if (input.answers.length !== REQUIRED_ANSWERS_COUNT) {
			errors.push(
				`A question must have exactly ${REQUIRED_ANSWERS_COUNT} answers`,
			);
		}

		// Validate correct answers count
		const correctCount = input.answers.filter((a) => a.isCorrect).length;
		if (correctCount !== 1) {
			errors.push("A question must have exactly 1 correct answer");
		}

		// Validate answers content (sanitized)
		const hasEmptyAnswer = input.answers.some(
			(a) => !a.content || sanitizeContent(a.content).length === 0,
		);
		if (hasEmptyAnswer) {
			errors.push("All answers must have non-empty content");
		}

		// Validate unique answers (case-insensitive)
		const normalizedAnswers = input.answers.map((a) =>
			normalizeForComparison(a.content ?? ""),
		);
		const uniqueAnswers = new Set(normalizedAnswers);
		if (uniqueAnswers.size !== normalizedAnswers.length) {
			errors.push("All answers must be unique");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
