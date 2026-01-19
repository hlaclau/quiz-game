/**
 * Base Domain Error
 * Represents a business rule violation in the domain layer
 */
export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DomainError";
	}
}

/**
 * Invalid Answers Count Error
 * Thrown when a question does not have exactly 4 answers
 */
export class InvalidAnswersCountError extends DomainError {
	constructor() {
		super("A question must have exactly 4 answers");
		this.name = "InvalidAnswersCountError";
	}
}

/**
 * Empty Content Error
 * Thrown when question or answer content is empty
 */
export class EmptyContentError extends DomainError {
	constructor(fieldName = "content") {
		super(`${fieldName} cannot be empty`);
		this.name = "EmptyContentError";
	}
}

/**
 * Content Too Long Error
 * Thrown when content exceeds maximum allowed length
 */
export class ContentTooLongError extends DomainError {
	constructor(fieldName: string, maxLength: number) {
		super(`${fieldName} cannot exceed ${maxLength} characters`);
		this.name = "ContentTooLongError";
	}
}

/**
 * Invalid Correct Answers Count Error
 * Thrown when a question does not have exactly one correct answer
 */
export class InvalidCorrectAnswersCountError extends DomainError {
	constructor() {
		super("A question must have exactly 1 correct answer");
		this.name = "InvalidCorrectAnswersCountError";
	}
}

/**
 * Empty Answer Content Error
 * Thrown when one or more answers have empty content
 */
export class EmptyAnswerContentError extends DomainError {
	constructor() {
		super("All answers must have non-empty content");
		this.name = "EmptyAnswerContentError";
	}
}

/**
 * Duplicate Answers Error
 * Thrown when two or more answers have the same content
 */
export class DuplicateAnswersError extends DomainError {
	constructor() {
		super("All answers must be unique");
		this.name = "DuplicateAnswersError";
	}
}
