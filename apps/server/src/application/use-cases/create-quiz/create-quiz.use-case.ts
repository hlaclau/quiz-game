import { Quiz } from "../../../domain/entities/quiz";
import { DomainError } from "../../../domain/errors/domain.error";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";
import type {
	CreateQuizInput,
	CreateQuizOutput,
	QuizDTO,
} from "./create-quiz.types";

/**
 * Maps a Quiz entity to a QuizDTO
 */
function toDTO(quiz: Quiz): QuizDTO {
	return {
		id: quiz.id,
		name: quiz.name,
		description: quiz.description,
		themeId: quiz.themeId,
		difficultyId: quiz.difficultyId,
		questionIds: [...quiz.questionIds],
		questionCount: quiz.getQuestionCount(),
		estimatedDuration: quiz.getEstimatedDuration(),
		isPublished: quiz.isPublished,
		createdAt: quiz.createdAt.toISOString(),
		updatedAt: quiz.updatedAt.toISOString(),
	};
}

/**
 * CreateQuiz Use Case
 * Creates a new quiz from a collection of questions
 */
export class CreateQuizUseCase {
	constructor(private readonly questionRepository: IQuestionRepository) {}

	async execute(input: CreateQuizInput): Promise<CreateQuizOutput> {
		// Fetch all questions
		const questions = await Promise.all(
			input.questionIds.map(async (id) => {
				const result = await this.questionRepository.findById(id);
				if (!result) {
					throw new DomainError(`Question with id ${id} not found`);
				}
				return result.question;
			}),
		);

		// Create quiz (will validate all business rules)
		const quiz = Quiz.create(
			input.name,
			input.description,
			input.themeId,
			input.difficultyId,
			questions,
		);

		// TODO: Persist quiz to repository when implemented
		// const savedQuiz = await this.quizRepository.create(quiz);

		return {
			data: toDTO(quiz),
		};
	}
}
