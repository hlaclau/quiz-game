import type { Answer } from "../entities/answer";
import { DomainError, InvalidAnswersCountError } from "../errors/domain.error";

/**
 * AnswerSet Value Object
 * Encapsulates the set of 4 answers with validation rules
 */
export class AnswerSet {
	private constructor(private readonly answers: Answer[]) {}

	static create(answers: Answer[]): AnswerSet {
		// Exactement 4 réponses
		if (answers.length !== 4) {
			throw new InvalidAnswersCountError();
		}

		// Exactement 1 bonne réponse
		const correctAnswers = answers.filter((a) => a.isCorrect);
		if (correctAnswers.length !== 1) {
			throw new DomainError("A question must have exactly 1 correct answer");
		}

		// Pas de réponses dupliquées
		const contents = answers.map((a) => a.content.toLowerCase());
		const uniqueContents = new Set(contents);
		if (uniqueContents.size !== answers.length) {
			throw new DomainError("Answers must be unique");
		}

		// Toutes les réponses doivent avoir un contenu significatif
		if (answers.some((a) => a.content.trim().length < 1)) {
			throw new DomainError("All answers must have meaningful content");
		}

		return new AnswerSet(answers);
	}

	getAnswers(): readonly Answer[] {
		return [...this.answers];
	}

	getCorrectAnswer(): Answer {
		const correct = this.answers.find((a) => a.isCorrect);
		if (!correct) {
			throw new Error("No correct answer found");
		}
		return correct;
	}

	shuffle(): AnswerSet {
		const shuffled = [...this.answers].sort(() => Math.random() - 0.5);
		return new AnswerSet(shuffled);
	}

	hasAnswer(answerId: string): boolean {
		return this.answers.some((a) => a.id === answerId);
	}

	count(): number {
		return this.answers.length;
	}
}
