import type { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";
import type {
	SetQuestionValidationInput,
	SetQuestionValidationOutput,
} from "./validate-question.types";

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
 * SetQuestionValidation Use Case
 * Sets the validation status of a question
 */
export class SetQuestionValidationUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(
		input: SetQuestionValidationInput,
	): Promise<SetQuestionValidationOutput> {
		const question = await this.questionRepository.setQuestionValidation(
			input.id,
			input.validated,
		);

		return {
			data: question ? toDTO(question) : null,
		};
	}
}
