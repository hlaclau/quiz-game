import { describe, expect, it } from "bun:test";
import {
	DomainError,
	InvalidAnswersCountError,
} from "../../../domain/errors/domain.error";

describe("Domain Errors", () => {
	describe("DomainError", () => {
		it("should create an error with the given message", () => {
			const error = new DomainError("Test error message");

			expect(error.message).toBe("Test error message");
			expect(error.name).toBe("DomainError");
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe("InvalidAnswersCountError", () => {
		it("should create an error with the correct message", () => {
			const error = new InvalidAnswersCountError();

			expect(error.message).toBe("A question must have exactly 4 answers");
			expect(error.name).toBe("InvalidAnswersCountError");
			expect(error).toBeInstanceOf(DomainError);
			expect(error).toBeInstanceOf(Error);
		});
	});
});
