import type { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";
import type {
	GetQuestionByIdInput,
	GetQuestionByIdOutput,
} from "./get-question-by-id.types";

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
		validated: question.validated,
		createdAt: question.createdAt.toISOString(),
		updatedAt: question.updatedAt.toISOString(),
	};
}

/**
 * GetQuestionById Use Case
 * Retrieves a question by its ID
 */
export class GetQuestionByIdUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: GetQuestionByIdInput): Promise<GetQuestionByIdOutput> {
		const question = await this.questionRepository.findById(input.id);

		return {
			data: question ? toDTO(question) : null,
		};
	}
}
