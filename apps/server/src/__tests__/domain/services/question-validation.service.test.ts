import { describe, expect, it } from "bun:test";
import {
	ContentTooLongError,
	DuplicateAnswersError,
	EmptyAnswerContentError,
	EmptyContentError,
	InvalidAnswersCountError,
	InvalidCorrectAnswersCountError,
} from "../../../domain/errors/domain.error";
import { QuestionValidationService } from "../../../domain/services";

describe("QuestionValidationService", () => {
	const validAnswers = [
		{ content: "Paris", isCorrect: true },
		{ content: "London", isCorrect: false },
		{ content: "Berlin", isCorrect: false },
		{ content: "Madrid", isCorrect: false },
	];

	const validInput = {
		content: "What is the capital of France?",
		answers: validAnswers,
	};

	describe("validate", () => {
		it("should pass with valid input", () => {
			expect(() =>
				QuestionValidationService.validate(validInput),
			).not.toThrow();
		});

		it("should throw EmptyContentError for empty question content", () => {
			expect(() =>
				QuestionValidationService.validate({ ...validInput, content: "" }),
			).toThrow(EmptyContentError);
		});

		it("should throw EmptyContentError for whitespace-only question content", () => {
			expect(() =>
				QuestionValidationService.validate({ ...validInput, content: "   " }),
			).toThrow(EmptyContentError);
		});

		it("should throw ContentTooLongError for question content exceeding max length", () => {
			const longContent = "a".repeat(501);
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					content: longContent,
				}),
			).toThrow(ContentTooLongError);
		});

		it("should throw InvalidAnswersCountError for fewer than 4 answers", () => {
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: validAnswers.slice(0, 3),
				}),
			).toThrow(InvalidAnswersCountError);
		});

		it("should throw InvalidAnswersCountError for more than 4 answers", () => {
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: [...validAnswers, { content: "Rome", isCorrect: false }],
				}),
			).toThrow(InvalidAnswersCountError);
		});

		it("should throw InvalidCorrectAnswersCountError for no correct answers", () => {
			const noCorrectAnswers = validAnswers.map((a) => ({
				...a,
				isCorrect: false,
			}));
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: noCorrectAnswers,
				}),
			).toThrow(InvalidCorrectAnswersCountError);
		});

		it("should throw InvalidCorrectAnswersCountError for multiple correct answers", () => {
			const multipleCorrect = validAnswers.map((a) => ({
				...a,
				isCorrect: true,
			}));
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: multipleCorrect,
				}),
			).toThrow(InvalidCorrectAnswersCountError);
		});

		it("should throw EmptyAnswerContentError for empty answer content", () => {
			const emptyAnswer = [
				{ content: "", isCorrect: true },
				{ content: "London", isCorrect: false },
				{ content: "Berlin", isCorrect: false },
				{ content: "Madrid", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: emptyAnswer,
				}),
			).toThrow(EmptyAnswerContentError);
		});

		it("should throw DuplicateAnswersError for duplicate answers", () => {
			const duplicateAnswers = [
				{ content: "Paris", isCorrect: true },
				{ content: "Paris", isCorrect: false },
				{ content: "Berlin", isCorrect: false },
				{ content: "Madrid", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: duplicateAnswers,
				}),
			).toThrow(DuplicateAnswersError);
		});

		it("should throw DuplicateAnswersError for case-insensitive duplicates", () => {
			const duplicateAnswers = [
				{ content: "Paris", isCorrect: true },
				{ content: "PARIS", isCorrect: false },
				{ content: "Berlin", isCorrect: false },
				{ content: "Madrid", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: duplicateAnswers,
				}),
			).toThrow(DuplicateAnswersError);
		});

		it("should throw DuplicateAnswersError for whitespace-normalized duplicates", () => {
			const duplicateAnswers = [
				{ content: "New York", isCorrect: true },
				{ content: "New  York", isCorrect: false },
				{ content: "Berlin", isCorrect: false },
				{ content: "Madrid", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validate({
					...validInput,
					answers: duplicateAnswers,
				}),
			).toThrow(DuplicateAnswersError);
		});
	});

	describe("validateAnswersCount", () => {
		it("should pass for exactly 4 answers", () => {
			expect(() =>
				QuestionValidationService.validateAnswersCount(4),
			).not.toThrow();
		});

		it("should throw for fewer than 4 answers", () => {
			expect(() => QuestionValidationService.validateAnswersCount(3)).toThrow(
				InvalidAnswersCountError,
			);
		});

		it("should throw for more than 4 answers", () => {
			expect(() => QuestionValidationService.validateAnswersCount(5)).toThrow(
				InvalidAnswersCountError,
			);
		});
	});

	describe("validateCorrectAnswersCount", () => {
		it("should pass for exactly 1 correct answer", () => {
			expect(() =>
				QuestionValidationService.validateCorrectAnswersCount(validAnswers),
			).not.toThrow();
		});

		it("should throw for no correct answers", () => {
			const noCorrect = validAnswers.map((a) => ({ ...a, isCorrect: false }));
			expect(() =>
				QuestionValidationService.validateCorrectAnswersCount(noCorrect),
			).toThrow(InvalidCorrectAnswersCountError);
		});

		it("should throw for multiple correct answers", () => {
			const multiCorrect = [
				{ content: "A", isCorrect: true },
				{ content: "B", isCorrect: true },
				{ content: "C", isCorrect: false },
				{ content: "D", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validateCorrectAnswersCount(multiCorrect),
			).toThrow(InvalidCorrectAnswersCountError);
		});
	});

	describe("validateAnswersContent", () => {
		it("should pass for non-empty answers", () => {
			expect(() =>
				QuestionValidationService.validateAnswersContent(validAnswers),
			).not.toThrow();
		});

		it("should throw for empty answer content", () => {
			const emptyContent = [
				{ content: "", isCorrect: true },
				{ content: "B", isCorrect: false },
				{ content: "C", isCorrect: false },
				{ content: "D", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validateAnswersContent(emptyContent),
			).toThrow(EmptyAnswerContentError);
		});

		it("should throw for whitespace-only answer content", () => {
			const whitespaceContent = [
				{ content: "   ", isCorrect: true },
				{ content: "B", isCorrect: false },
				{ content: "C", isCorrect: false },
				{ content: "D", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validateAnswersContent(whitespaceContent),
			).toThrow(EmptyAnswerContentError);
		});
	});

	describe("validateUniqueAnswers", () => {
		it("should pass for unique answers", () => {
			expect(() =>
				QuestionValidationService.validateUniqueAnswers(validAnswers),
			).not.toThrow();
		});

		it("should throw for duplicate answers", () => {
			const duplicates = [
				{ content: "Same", isCorrect: true },
				{ content: "Same", isCorrect: false },
				{ content: "Different", isCorrect: false },
				{ content: "Another", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validateUniqueAnswers(duplicates),
			).toThrow(DuplicateAnswersError);
		});

		it("should be case-insensitive", () => {
			const caseInsensitive = [
				{ content: "Answer", isCorrect: true },
				{ content: "ANSWER", isCorrect: false },
				{ content: "Different", isCorrect: false },
				{ content: "Another", isCorrect: false },
			];
			expect(() =>
				QuestionValidationService.validateUniqueAnswers(caseInsensitive),
			).toThrow(DuplicateAnswersError);
		});
	});

	describe("validateWithResult", () => {
		it("should return valid result for valid input", () => {
			const result = QuestionValidationService.validateWithResult(validInput);
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("should collect all errors", () => {
			const invalidInput = {
				content: "",
				answers: [
					{ content: "", isCorrect: false },
					{ content: "", isCorrect: false },
				],
			};
			const result = QuestionValidationService.validateWithResult(invalidInput);
			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});

		it("should include error for empty question content", () => {
			const result = QuestionValidationService.validateWithResult({
				...validInput,
				content: "",
			});
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("Question content cannot be empty");
		});

		it("should include error for duplicate answers", () => {
			const duplicateAnswers = [
				{ content: "Same", isCorrect: true },
				{ content: "Same", isCorrect: false },
				{ content: "Different", isCorrect: false },
				{ content: "Another", isCorrect: false },
			];
			const result = QuestionValidationService.validateWithResult({
				...validInput,
				answers: duplicateAnswers,
			});
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("All answers must be unique");
		});
	});
});
