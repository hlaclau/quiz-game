/**
 * Result of a single answer in a quiz
 */
export interface AnswerResult {
	questionId: string;
	isCorrect: boolean;
	difficultyLevel: number;
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
	basePointsPerQuestion: number;
	streakBonusMultiplier: number; // Bonus multiplier per consecutive correct
	maxStreakBonus: number; // Cap on streak bonus
	difficultyMultipliers: Map<number, number>; // level -> multiplier
}

/**
 * Default scoring configuration
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
	basePointsPerQuestion: 100,
	streakBonusMultiplier: 0.1, // 10% bonus per streak
	maxStreakBonus: 0.5, // Max 50% streak bonus
	difficultyMultipliers: new Map([
		[1, 1.0], // Easy
		[2, 1.5], // Medium
		[3, 2.0], // Hard
	]),
};

/**
 * Individual score breakdown item
 */
export interface ScoreBreakdownItem {
	questionId: string;
	basePoints: number;
	difficultyMultiplier: number;
	streakBonus: number;
	totalPoints: number;
}

/**
 * Quiz round score summary
 */
export interface QuizScoreSummary {
	totalScore: number;
	correctAnswers: number;
	totalQuestions: number;
	longestStreak: number;
	currentStreak: number;
	accuracyPercentage: number;
	scoreBreakdown: ScoreBreakdownItem[];
}

/**
 * QuizScoringService Domain Service
 * Encapsulates all quiz scoring logic - pure domain logic with no dependencies
 */
export class QuizScoringService {
	private readonly config: ScoringConfig;

	constructor(config: ScoringConfig = DEFAULT_SCORING_CONFIG) {
		this.config = config;
	}

	/**
	 * Calculate the score for a complete quiz round
	 */
	calculateRoundScore(results: AnswerResult[]): QuizScoreSummary {
		let totalScore = 0;
		let currentStreak = 0;
		let longestStreak = 0;
		let correctAnswers = 0;
		const scoreBreakdown: ScoreBreakdownItem[] = [];

		for (const result of results) {
			if (result.isCorrect) {
				correctAnswers++;
				currentStreak++;
				longestStreak = Math.max(longestStreak, currentStreak);

				const breakdown = this.calculateQuestionScore(
					result.questionId,
					result.difficultyLevel,
					currentStreak,
				);

				scoreBreakdown.push(breakdown);
				totalScore += breakdown.totalPoints;
			} else {
				currentStreak = 0;
				scoreBreakdown.push({
					questionId: result.questionId,
					basePoints: 0,
					difficultyMultiplier: 0,
					streakBonus: 0,
					totalPoints: 0,
				});
			}
		}

		return {
			totalScore,
			correctAnswers,
			totalQuestions: results.length,
			longestStreak,
			currentStreak,
			accuracyPercentage:
				results.length > 0 ? (correctAnswers / results.length) * 100 : 0,
			scoreBreakdown,
		};
	}

	/**
	 * Calculate score for a single correct answer
	 */
	calculateQuestionScore(
		questionId: string,
		difficultyLevel: number,
		currentStreak: number,
	): ScoreBreakdownItem {
		const basePoints = this.config.basePointsPerQuestion;

		// Get difficulty multiplier (default to 1.0 if not found)
		const difficultyMultiplier =
			this.config.difficultyMultipliers.get(difficultyLevel) ?? 1.0;

		// Calculate streak bonus (capped at maxStreakBonus)
		const streakBonus = Math.min(
			(currentStreak - 1) * this.config.streakBonusMultiplier,
			this.config.maxStreakBonus,
		);

		// Total points = base * difficulty * (1 + streakBonus)
		const totalPoints = Math.round(
			basePoints * difficultyMultiplier * (1 + streakBonus),
		);

		return {
			questionId,
			basePoints,
			difficultyMultiplier,
			streakBonus,
			totalPoints,
		};
	}

	/**
	 * Calculate streak bonus multiplier for display
	 */
	getStreakBonusPercentage(streak: number): number {
		if (streak <= 1) return 0;
		const bonus = (streak - 1) * this.config.streakBonusMultiplier;
		return Math.min(bonus, this.config.maxStreakBonus) * 100;
	}

	/**
	 * Get difficulty multiplier for a level
	 */
	getDifficultyMultiplier(level: number): number {
		return this.config.difficultyMultipliers.get(level) ?? 1.0;
	}
}
