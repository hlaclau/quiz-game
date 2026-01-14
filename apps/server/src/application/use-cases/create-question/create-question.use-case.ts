import { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type { QuestionDTO } from "../../dtos/question.dto";
import type {
	CreateQuestionInput,
	CreateQuestionOutput,
} from "./create-question.types";

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
 * CreateQuestion Use Case
 * Creates a new question with answers and tags
 */
export class CreateQuestionUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: CreateQuestionInput): Promise<CreateQuestionOutput> {
		// Validate domain rules
		Question.validateAnswersCount(input.answers.length);

		const question = await this.questionRepository.create({
			content: input.content,
			explanation: input.explanation ?? null,
			difficultyId: input.difficultyId,
			themeId: input.themeId,
			authorId: input.authorId,
			answers: input.answers,
			tagIds: input.tagIds,
		});

		return {
			data: toDTO(question),
		};
	}
}
