import { DomainError } from "../errors/domain.error";

/**
 * QuestionContent Value Object
 * Encapsulates question content with validation rules
 */
export class QuestionContent {
	private constructor(private readonly value: string) {}

	static create(content: string): QuestionContent {
		const trimmed = content.trim();

		if (trimmed.length < 10) {
			throw new DomainError("Question must be at least 10 characters");
		}

		if (trimmed.length > 500) {
			throw new DomainError("Question must not exceed 500 characters");
		}

		if (!trimmed.includes("?")) {
			throw new DomainError("Question should contain a question mark");
		}

		return new QuestionContent(trimmed);
	}

	getValue(): string {
		return this.value;
	}

	equals(other: QuestionContent): boolean {
		return this.value === other.value;
	}

	toString(): string {
		return this.value;
	}
}
