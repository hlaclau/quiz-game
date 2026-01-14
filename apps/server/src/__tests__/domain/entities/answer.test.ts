import { describe, expect, it } from "bun:test";
import { Answer } from "../../../domain/entities/answer";

describe("Answer Entity", () => {
	const validProps = {
		id: "answer-123",
		content: "4",
		isCorrect: true,
		questionId: "question-123",
		createdAt: new Date("2024-01-01"),
	};

	describe("create", () => {
		it("should create an answer with all properties", () => {
			const answer = Answer.create(validProps);

			expect(answer.id).toBe(validProps.id);
			expect(answer.content).toBe(validProps.content);
			expect(answer.isCorrect).toBe(validProps.isCorrect);
			expect(answer.questionId).toBe(validProps.questionId);
			expect(answer.createdAt).toEqual(validProps.createdAt);
		});

		it("should create a correct answer", () => {
			const answer = Answer.create({ ...validProps, isCorrect: true });

			expect(answer.isCorrect).toBe(true);
		});

		it("should create an incorrect answer", () => {
			const answer = Answer.create({ ...validProps, isCorrect: false });

			expect(answer.isCorrect).toBe(false);
		});
	});
});
