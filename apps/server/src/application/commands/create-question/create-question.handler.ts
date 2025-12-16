import { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";
import type { CreateQuestionRequest } from "./create-question.request";
import type { CreateQuestionResponse } from "./create-question.response";

/**
 * Maps a Question entity to a QuestionDTO
 */
function toDTO(question: Question): QuestionDTO {
	return {
		id: question.id,
		content: question.content,
		explanation: question.explanation,
		difficultyId: question.difficultyId,
		themeId: question.themeId,
		authorId: question.authorId,
		createdAt: question.createdAt.toISOString(),
		updatedAt: question.updatedAt.toISOString(),
	};
}

/**
 * CreateQuestion Command Handler
 * CQRS Handler - creates a new question with answers and tags
 */
export class CreateQuestionHandler {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(
		request: CreateQuestionRequest,
	): Promise<CreateQuestionResponse> {
		// Validate domain rules
		Question.validateAnswersCount(request.answers.length);

		const question = await this.questionRepository.create({
			content: request.content,
			explanation: request.explanation ?? null,
			difficultyId: request.difficultyId,
			themeId: request.themeId,
			authorId: request.authorId,
			answers: request.answers,
			tagIds: request.tagIds,
		});

		return {
			data: toDTO(question),
		};
	}
}
