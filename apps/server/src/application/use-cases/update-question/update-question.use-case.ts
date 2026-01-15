import type { Answer } from "../../../domain/entities/answer";
import { Question } from "../../../domain/entities/question";
import type {
	IQuestionRepository,
	QuestionWithAnswers,
} from "../../../domain/interfaces/question-repository.interface";
import type { AnswerDTO } from "../../dtos/answer.dto";
import type {
	QuestionWithAnswersDTO,
	UpdateQuestionInput,
	UpdateQuestionOutput,
} from "./update-question.types";

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
 * UpdateQuestion Use Case
 * Updates an existing question with answers and tags
 */
export class UpdateQuestionUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: UpdateQuestionInput): Promise<UpdateQuestionOutput> {
		// Validate domain rules
		Question.validateAnswersCount(input.answers.length);

		const result = await this.questionRepository.update({
			id: input.id,
			content: input.content,
			explanation: input.explanation ?? null,
			difficultyId: input.difficultyId,
			themeId: input.themeId,
			answers: input.answers,
			tagIds: input.tagIds,
		});

		return {
			data: result ? toDTO(result) : null,
		};
	}
}
