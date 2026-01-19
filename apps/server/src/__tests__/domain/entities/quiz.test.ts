import { describe, expect, test } from "bun:test";
import { Question } from "../../../domain/entities/question";
import { Quiz } from "../../../domain/entities/quiz";

describe("Quiz Aggregate", () => {
	// Helper to create a validated question
	const createValidQuestion = (
		id: string,
		themeId: string,
		difficultyId: string,
	): Question => {
		return Question.create({
			id,
			content: "What is TypeScript?",
			explanation: "TypeScript is a typed superset of JavaScript",
			difficultyId,
			themeId,
			authorId: "author-1",
			validated: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	};

	describe("create", () => {
		test("should create a valid quiz with 5-20 questions", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create(
				"JavaScript Basics",
				"Test your JS knowledge",
				"theme-1",
				"diff-1",
				questions,
			);

			expect(quiz.name).toBe("JavaScript Basics");
			expect(quiz.getQuestionCount()).toBe(5);
			expect(quiz.isPublished).toBe(false);
		});

		test("should reject quiz with less than 5 questions", () => {
			const questions = Array.from({ length: 4 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			expect(() => {
				Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			}).toThrow("A quiz must have at least 5 questions");
		});

		test("should reject quiz with more than 20 questions", () => {
			const questions = Array.from({ length: 21 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			expect(() => {
				Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			}).toThrow("A quiz cannot have more than 20 questions");
		});

		test("should reject quiz with non-validated questions", () => {
			const questions = [
				createValidQuestion("q-1", "theme-1", "diff-1"),
				createValidQuestion("q-2", "theme-1", "diff-1"),
				createValidQuestion("q-3", "theme-1", "diff-1"),
				createValidQuestion("q-4", "theme-1", "diff-1"),
				Question.create({
					id: "q-5",
					content: "Invalid question?",
					explanation: null,
					difficultyId: "diff-1",
					themeId: "theme-1",
					authorId: "author-1",
					validated: false, // Not validated!
					createdAt: new Date(),
					updatedAt: new Date(),
				}),
			];

			expect(() => {
				Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			}).toThrow("All questions in a quiz must be validated");
		});

		test("should reject quiz with mixed themes", () => {
			const questions = [
				createValidQuestion("q-1", "theme-1", "diff-1"),
				createValidQuestion("q-2", "theme-1", "diff-1"),
				createValidQuestion("q-3", "theme-1", "diff-1"),
				createValidQuestion("q-4", "theme-1", "diff-1"),
				createValidQuestion("q-5", "theme-2", "diff-1"), // Different theme!
			];

			expect(() => {
				Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			}).toThrow("All questions must belong to the same theme");
		});

		test("should reject quiz with short name", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			expect(() => {
				Quiz.create("AB", null, "theme-1", "diff-1", questions);
			}).toThrow("Quiz name must be at least 3 characters");
		});
	});

	describe("addQuestion", () => {
		test("should add a valid question to unpublished quiz", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			const newQuestion = createValidQuestion("q-new", "theme-1", "diff-1");

			const updatedQuiz = quiz.addQuestion(newQuestion);

			expect(updatedQuiz.getQuestionCount()).toBe(6);
			expect(updatedQuiz.hasQuestion("q-new")).toBe(true);
		});

		test("should reject adding question to published quiz", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			const publishedQuiz = quiz.publish();
			const newQuestion = createValidQuestion("q-new", "theme-1", "diff-1");

			expect(() => {
				publishedQuiz.addQuestion(newQuestion);
			}).toThrow("Cannot modify a published quiz");
		});

		test("should reject duplicate question", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);

			expect(() => {
				quiz.addQuestion(questions[0]);
			}).toThrow("Question already exists in quiz");
		});
	});

	describe("publish", () => {
		test("should publish a valid quiz", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			const publishedQuiz = quiz.publish();

			expect(publishedQuiz.isPublished).toBe(true);
			expect(publishedQuiz.canBeModified()).toBe(false);
		});

		test("should reject publishing already published quiz", () => {
			const questions = Array.from({ length: 5 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);
			const publishedQuiz = quiz.publish();

			expect(() => {
				publishedQuiz.publish();
			}).toThrow("Quiz is already published");
		});
	});

	describe("getEstimatedDuration", () => {
		test("should calculate duration based on question count", () => {
			const questions = Array.from({ length: 10 }, (_, i) =>
				createValidQuestion(`q-${i}`, "theme-1", "diff-1"),
			);

			const quiz = Quiz.create("JS Quiz", null, "theme-1", "diff-1", questions);

			// 10 questions * 45 seconds = 450 seconds
			expect(quiz.getEstimatedDuration()).toBe(450);
		});
	});
});
