import { Question } from "../../../domain/entities/question";
import { DomainError } from "../../../domain/errors/domain.error";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import { QuestionContent } from "../../../domain/value-objects";
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
		validated: question.validated,
		createdAt: question.createdAt.toISOString(),
		updatedAt: question.updatedAt.toISOString(),
	};
}

/**
 * CreateQuestion Use Case
 * Creates a new question with answers and tags
 * Now with enhanced domain validation
 */
export class CreateQuestionUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: CreateQuestionInput): Promise<CreateQuestionOutput> {
		// Validate question content using Value Object
		const questionContent = QuestionContent.create(input.content);

		// Validate answers count
		Question.validateAnswersCount(input.answers.length);

		// Validate exactly 1 correct answer (domain rule)
		const correctAnswers = input.answers.filter((a) => a.isCorrect);
		if (correctAnswers.length !== 1) {
			throw new DomainError("A question must have exactly 1 correct answer");
		}

		// Validate unique answers (domain rule)
		const answerContents = input.answers.map((a) => a.content.toLowerCase());
		const uniqueContents = new Set(answerContents);
		if (uniqueContents.size !== input.answers.length) {
			throw new DomainError("All answers must be unique");
		}

		// Validate meaningful answer content (domain rule)
		if (input.answers.some((a) => a.content.trim().length < 1)) {
			throw new DomainError("All answers must have meaningful content");
		}

		const question = await this.questionRepository.create({
			content: questionContent.getValue(),
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
