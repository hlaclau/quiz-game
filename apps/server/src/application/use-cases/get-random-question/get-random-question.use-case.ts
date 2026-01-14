import type { Answer } from "../../../domain/entities/answer";
import type {
	IQuestionRepository,
	QuestionWithAnswers,
} from "../../../domain/interfaces/question-repository.interface";
import type { AnswerDTO } from "../../dtos/answer.dto";
import type {
	GetRandomQuestionsInput,
	GetRandomQuestionsOutput,
	QuestionWithAnswersDTO,
} from "./get-random-question.types";

/**
 * Maps an Answer entity to an AnswerDTO
 */
function answerToDTO(answer: Answer): AnswerDTO {
	return {
		id: answer.id,
		content: answer.content,
		isCorrect: answer.isCorrect,
		createdAt: answer.createdAt.toISOString(),
	};
}

/**
 * Maps a QuestionWithAnswers to a QuestionWithAnswersDTO
 */
function toDTO(data: QuestionWithAnswers): QuestionWithAnswersDTO {
	const { question, answers } = data;
	return {
		id: question.id,
		content: question.content,
		explanation: question.explanation,
		difficultyId: question.difficultyId,
		themeId: question.themeId,
		authorId: question.authorId,
		validated: question.validated,
		createdAt: question.createdAt.toISOString(),
		updatedAt: question.updatedAt.toISOString(),
		answers: answers.map(answerToDTO),
	};
}

/**
 * GetRandomQuestions Use Case
 * Retrieves multiple random validated questions by theme (no duplicates)
 */
export class GetRandomQuestionsUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(
		input: GetRandomQuestionsInput,
	): Promise<GetRandomQuestionsOutput> {
		const results = await this.questionRepository.findRandomByTheme(
			input.themeId,
			input.limit,
		);

		return {
			data: results.map(toDTO),
		};
	}
}
