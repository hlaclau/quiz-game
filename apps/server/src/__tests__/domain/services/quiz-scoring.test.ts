import { describe, expect, test } from "bun:test";
import { Difficulty } from "../../../domain/entities/difficulty";
import { Question } from "../../../domain/entities/question";
import {
	calculateScore,
	calculateSuccessRate,
	canLevelUp,
	estimateDuration,
	getPerformanceRating,
} from "../../../domain/services/quiz-scoring.service";

describe("Quiz Scoring Service", () => {
	const createQuestion = (): Question => {
		return Question.create({
			id: "q-1",
			content: "What is TypeScript?",
			explanation: "A typed superset of JavaScript",
			difficultyId: "diff-1",
			themeId: "theme-1",
			authorId: "author-1",
			validated: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	};

	const createDifficulty = (level: number): Difficulty => {
		return Difficulty.create({
			id: `diff-${level}`,
			name: `Level ${level}`,
			level,
			color: "#000000",
			createdAt: new Date(),
		});
	};

	describe("calculateScore", () => {
		test("should return 0 for incorrect answer", () => {
			const question = createQuestion();
			const difficulty = createDifficulty(3);

			const score = calculateScore(
				question,
				difficulty,
				30, // time doesn't matter for wrong answer
				false,
			);

			expect(score).toBe(0);
		});

		test("should calculate base score for correct answer", () => {
			const question = createQuestion();
			const difficulty = createDifficulty(3);

			const score = calculateScore(
				question,
				difficulty,
				60, // max time, no bonus
				true,
			);

			// Base: 10 * 3 = 30, Time bonus: 0
			expect(score).toBe(30);
		});

		test("should add time bonus for fast answer", () => {
			const question = createQuestion();
			const difficulty = createDifficulty(3);

			const score = calculateScore(
				question,
				difficulty,
				0, // instant answer
				true,
			);

			// Base: 30, Time bonus: 15 (50% of base)
			expect(score).toBe(45);
		});

		test("should scale with difficulty level", () => {
			const question = createQuestion();
			const easyDifficulty = createDifficulty(1);
			const hardDifficulty = createDifficulty(5);

			const easyScore = calculateScore(question, easyDifficulty, 60, true);

			const hardScore = calculateScore(question, hardDifficulty, 60, true);

			expect(easyScore).toBe(10); // 10 * 1
			expect(hardScore).toBe(50); // 10 * 5
		});
	});

	describe("calculateSuccessRate", () => {
		test("should calculate correct percentage", () => {
			expect(calculateSuccessRate(8, 10)).toBe(80);
			expect(calculateSuccessRate(10, 10)).toBe(100);
			expect(calculateSuccessRate(5, 10)).toBe(50);
		});

		test("should return 0 for no questions", () => {
			expect(calculateSuccessRate(0, 0)).toBe(0);
		});
	});

	describe("canLevelUp", () => {
		test("should allow level up with 80% success and 10+ questions", () => {
			const difficulty = createDifficulty(2);
			const canLevel = canLevelUp(8, 10, difficulty);

			expect(canLevel).toBe(true);
		});

		test("should reject level up with less than 80% success", () => {
			const difficulty = createDifficulty(2);
			const canLevel = canLevelUp(7, 10, difficulty);

			expect(canLevel).toBe(false);
		});

		test("should reject level up with less than 10 questions", () => {
			const difficulty = createDifficulty(2);
			const canLevel = canLevelUp(8, 9, difficulty);

			expect(canLevel).toBe(false);
		});

		test("should reject level up at max difficulty", () => {
			const difficulty = createDifficulty(5);
			const canLevel = canLevelUp(10, 10, difficulty);

			expect(canLevel).toBe(false);
		});
	});

	describe("getPerformanceRating", () => {
		test("should return correct ratings", () => {
			expect(getPerformanceRating(95)).toBe("Excellent");
			expect(getPerformanceRating(85)).toBe("Très bien");
			expect(getPerformanceRating(75)).toBe("Bien");
			expect(getPerformanceRating(65)).toBe("Moyen");
			expect(getPerformanceRating(55)).toBe("Passable");
			expect(getPerformanceRating(45)).toBe("À améliorer");
		});
	});

	describe("estimateDuration", () => {
		test("should estimate 45 seconds per question", () => {
			expect(estimateDuration(10)).toBe(450);
			expect(estimateDuration(5)).toBe(225);
			expect(estimateDuration(20)).toBe(900);
		});
	});
});
