import { describe, expect, it } from "bun:test";
import {
	Question,
	REQUIRED_ANSWERS_COUNT,
} from "../../../domain/entities/question";
import { InvalidAnswersCountError } from "../../../domain/errors/domain.error";

describe("Question Entity", () => {
	const validProps = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		content: "What is 2 + 2?",
		explanation: "Basic arithmetic",
		difficultyId: "diff-1",
		themeId: "theme-1",
		authorId: "author-1",
		validated: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-02"),
	};

	describe("create", () => {
		it("should create a question with all properties", () => {
			const question = Question.create(validProps);

			expect(question.id).toBe(validProps.id);
			expect(question.content).toBe(validProps.content);
			expect(question.explanation).toBe(validProps.explanation);
			expect(question.difficultyId).toBe(validProps.difficultyId);
			expect(question.themeId).toBe(validProps.themeId);
			expect(question.authorId).toBe(validProps.authorId);
			expect(question.createdAt).toEqual(validProps.createdAt);
			expect(question.updatedAt).toEqual(validProps.updatedAt);
		});

		it("should create a question with null explanation", () => {
			const question = Question.create({ ...validProps, explanation: null });

			expect(question.explanation).toBeNull();
		});
	});

	describe("validateAnswersCount", () => {
		it("should pass when answers count equals REQUIRED_ANSWERS_COUNT", () => {
			expect(() =>
				Question.validateAnswersCount(REQUIRED_ANSWERS_COUNT),
			).not.toThrow();
		});

		it("should throw InvalidAnswersCountError when count is less than required", () => {
			expect(() => Question.validateAnswersCount(3)).toThrow(
				InvalidAnswersCountError,
			);
			expect(() => Question.validateAnswersCount(0)).toThrow(
				InvalidAnswersCountError,
			);
		});

		it("should throw InvalidAnswersCountError when count is greater than required", () => {
			expect(() => Question.validateAnswersCount(5)).toThrow(
				InvalidAnswersCountError,
			);
			expect(() => Question.validateAnswersCount(10)).toThrow(
				InvalidAnswersCountError,
			);
		});
	});

	describe("REQUIRED_ANSWERS_COUNT", () => {
		it("should be 4", () => {
			expect(REQUIRED_ANSWERS_COUNT).toBe(4);
		});
	});
});
