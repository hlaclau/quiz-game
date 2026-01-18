import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";

export interface ValidateAnswerInput {
	questionId: string;
	answerId: string;
}

export interface ValidateAnswerOutput {
	isCorrect: boolean;
	correctAnswerId: string;
}

export class ValidateAnswerUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: ValidateAnswerInput): Promise<ValidateAnswerOutput> {
		const question = await this.questionRepository.findById(input.questionId);

		if (!question) {
			throw new Error("Question not found");
		}

		const selectedAnswer = question.answers.find(
			(a) => a.id === input.answerId,
		);
		if (!selectedAnswer) {
			throw new Error("Answer not found");
		}

		const correctAnswer = question.answers.find((a) => a.isCorrect);
		if (!correctAnswer) {
			throw new Error("No correct answer found for this question");
		}

		return {
			isCorrect: selectedAnswer.isCorrect,
			correctAnswerId: correctAnswer.id,
		};
	}
}
