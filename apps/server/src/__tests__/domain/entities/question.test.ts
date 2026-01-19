import { describe, expect, it } from "bun:test";
import {
	Question,
	REQUIRED_ANSWERS_COUNT,
} from "../../../domain/entities/question";

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

	describe("REQUIRED_ANSWERS_COUNT", () => {
		it("should be 4", () => {
			expect(REQUIRED_ANSWERS_COUNT).toBe(4);
		});
	});
});
