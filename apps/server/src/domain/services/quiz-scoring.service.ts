import type { Difficulty } from "../entities/difficulty";
import type { Question } from "../entities/question";

/**
 * QuizScoringService
 * Domain service for calculating quiz scores and progression
 */

/**
 * Calculate score for a single answer
 */
export function calculateScore(
	question: Question,
	difficulty: Difficulty,
	timeSpentInSeconds: number,
	isCorrect: boolean,
): number {
	if (!isCorrect) {
		return 0;
	}

	const basePoints = question.calculatePoints(difficulty);

	// Bonus de temps : plus on répond vite, plus on gagne de points
	const maxTimeBonus = basePoints * 0.5; // 50% de bonus max
	const maxTimeInSeconds = 60; // 1 minute pour répondre
	const timeBonus = Math.max(
		0,
		maxTimeBonus * (1 - timeSpentInSeconds / maxTimeInSeconds),
	);

	return Math.round(basePoints + timeBonus);
}

/**
 * Calculate total score for a quiz session
 */
export function calculateTotalScore(
	correctAnswers: number,
	totalQuestions: number,
	difficulty: Difficulty,
	averageTimeInSeconds: number,
): number {
	const baseScore = correctAnswers * 10 * difficulty.level;

	// Bonus for speed (average time per question)
	const speedBonus = Math.max(
		0,
		correctAnswers * 5 * (1 - averageTimeInSeconds / 60),
	);

	// Bonus for perfect score
	const perfectBonus = correctAnswers === totalQuestions ? 100 : 0;

	return Math.round(baseScore + speedBonus + perfectBonus);
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate(
	correctAnswers: number,
	totalQuestions: number,
): number {
	if (totalQuestions === 0) {
		return 0;
	}
	return (correctAnswers / totalQuestions) * 100;
}

/**
 * Determine if a player can level up to next difficulty
 */
export function canLevelUp(
	correctAnswers: number,
	totalQuestions: number,
	currentDifficulty: Difficulty,
): boolean {
	const successRate = calculateSuccessRate(correctAnswers, totalQuestions);

	// Need at least 80% success rate
	if (successRate < 80) {
		return false;
	}

	// Need at least 10 questions answered
	if (totalQuestions < 10) {
		return false;
	}

	// Cannot level up beyond max difficulty
	if (currentDifficulty.isMaxDifficulty()) {
		return false;
	}

	return true;
}

/**
 * Get performance rating based on success rate
 */
export function getPerformanceRating(successRate: number): string {
	if (successRate >= 90) {
		return "Excellent";
	}
	if (successRate >= 80) {
		return "Très bien";
	}
	if (successRate >= 70) {
		return "Bien";
	}
	if (successRate >= 60) {
		return "Moyen";
	}
	if (successRate >= 50) {
		return "Passable";
	}
	return "À améliorer";
}

/**
 * Calculate estimated time to complete based on question count
 */
export function estimateDuration(questionCount: number): number {
	// Average 45 seconds per question
	return questionCount * 45;
}
