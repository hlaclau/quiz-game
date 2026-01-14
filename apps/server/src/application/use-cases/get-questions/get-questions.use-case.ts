import type { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";
import type {
	GetQuestionsInput,
	GetQuestionsOutput,
} from "./get-questions.types";

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
 * GetQuestions Use Case
 * Retrieves paginated questions with optional theme filter
 */
export class GetQuestionsUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: GetQuestionsInput): Promise<GetQuestionsOutput> {
		const { page, limit, themeId } = input;

		const result = await this.questionRepository.findAll(
			{ themeId },
			{ page, limit },
		);

		const data = result.data.map(toDTO);
		const totalPages = Math.ceil(result.total / limit);

		return {
			data,
			total: result.total,
			page,
			limit,
			totalPages,
		};
	}
}
