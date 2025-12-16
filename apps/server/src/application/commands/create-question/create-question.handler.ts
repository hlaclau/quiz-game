import type { Question } from "../../../domain/entities/question";
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

	async execute(request: CreateQuestionRequest): Promise<CreateQuestionResponse> {
		console.log("[CreateQuestionHandler] Starting execute...");
		console.log("[CreateQuestionHandler] Request received:", JSON.stringify(request, null, 2));

		try {
			console.log("[CreateQuestionHandler] Calling repository.create...");
			const question = await this.questionRepository.create({
				content: request.content,
				explanation: request.explanation ?? null,
				difficultyId: request.difficultyId,
				themeId: request.themeId,
				authorId: request.authorId,
				answers: request.answers,
				tagIds: request.tagIds,
			});

			console.log("[CreateQuestionHandler] Question created successfully:", question.id);

			return {
				data: toDTO(question),
			};
		} catch (error) {
			console.error("[CreateQuestionHandler] Error:", error);
			throw error;
		}
	}
}
