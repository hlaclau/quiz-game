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
