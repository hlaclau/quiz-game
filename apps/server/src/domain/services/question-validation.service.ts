import type { Answer } from "../entities/answer";
import type { Difficulty } from "../entities/difficulty";
import type { Question } from "../entities/question";
import type { Theme } from "../entities/theme";

/**
 * Validation result
 */
export interface ValidationResult {
	valid: boolean;
	reasons: string[];
}

/**
 * QuestionValidationService
 * Domain service for validating questions against business rules
 */

/**
 * Check if a question can be validated
 */
export function canValidateQuestion(
	question: Question,
	answers: Answer[],
	_theme: Theme,
	_difficulty: Difficulty,
): ValidationResult {
	const reasons: string[] = [];

	// Check if already validated
	if (question.validated) {
		reasons.push("Question is already validated");
	}

	// Check if has exactly 4 answers
	if (answers.length !== 4) {
		reasons.push("Question must have exactly 4 answers");
	}

	// Check if has exactly 1 correct answer
	const correctAnswers = answers.filter((a) => a.isCorrect);
	if (correctAnswers.length !== 1) {
		reasons.push("Question must have exactly 1 correct answer");
	}

	// Check for duplicate answers
	const answerContents = answers.map((a) => a.content.toLowerCase());
	const uniqueContents = new Set(answerContents);
	if (uniqueContents.size !== answers.length) {
		reasons.push("Question has duplicate answers");
	}

	// Check if all answers have meaningful content
	if (answers.some((a) => a.content.trim().length < 1)) {
		reasons.push("All answers must have meaningful content");
	}

	// Check if question content is valid
	if (question.content.trim().length < 10) {
		reasons.push("Question content must be at least 10 characters");
	}

	if (!question.content.includes("?")) {
		reasons.push("Question should contain a question mark");
	}

	return {
		valid: reasons.length === 0,
		reasons,
	};
}

/**
 * Check if a question is suitable for a given difficulty level
 */
export function isSuitableForDifficulty(
	question: Question,
	difficulty: Difficulty,
): boolean {
	const contentLength = question.content.length;

	// Règles de base : questions faciles sont plus courtes
	if (difficulty.level === 1 && contentLength > 200) {
		return false;
	}

	// Questions difficiles devraient avoir une explication
	if (difficulty.level >= 4 && !question.explanation) {
		return false;
	}

	return true;
}

/**
 * Validate that answers are well-distributed (not obvious)
 */
export function hasBalancedAnswers(answers: Answer[]): boolean {
	// Check that answers have similar lengths (not one very short correct answer)
	const lengths = answers.map((a) => a.content.length);
	const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

	// Check if any answer is less than 50% of average length
	const tooShort = lengths.some((len) => len < avgLength * 0.5);
	if (tooShort) {
		return false;
	}

	// Check if any answer is more than 200% of average length
	const tooLong = lengths.some((len) => len > avgLength * 2);
	if (tooLong) {
		return false;
	}

	return true;
}
