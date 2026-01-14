import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { CreateQuestionInput } from "../../../application/use-cases/create-question/create-question.types";
import { CreateQuestionUseCase } from "../../../application/use-cases/create-question/create-question.use-case";
import { Question } from "../../../domain/entities/question";
import { InvalidAnswersCountError } from "../../../domain/errors/domain.error";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";

describe("CreateQuestionUseCase", () => {
	let useCase: CreateQuestionUseCase;
	let mockRepository: IQuestionRepository;

	const validInput: CreateQuestionInput = {
		content: "What is 2 + 2?",
		explanation: "Basic math",
		difficultyId: "diff-1",
		themeId: "theme-1",
		authorId: "author-1",
		answers: [
			{ content: "3", isCorrect: false },
			{ content: "4", isCorrect: true },
			{ content: "5", isCorrect: false },
			{ content: "6", isCorrect: false },
		],
	};

	const mockQuestion = Question.create({
		id: "question-123",
		content: validInput.content,
		explanation: validInput.explanation ?? null,
		difficultyId: validInput.difficultyId,
		themeId: validInput.themeId,
		authorId: validInput.authorId,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	});

	beforeEach(() => {
		mockRepository = {
			create: mock(() => Promise.resolve(mockQuestion)),
		};
		useCase = new CreateQuestionUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should create a question with valid input", async () => {
			const result = await useCase.execute(validInput);

			expect(result.data).toEqual({
				id: mockQuestion.id,
				content: mockQuestion.content,
				explanation: mockQuestion.explanation,
				difficultyId: mockQuestion.difficultyId,
				themeId: mockQuestion.themeId,
				authorId: mockQuestion.authorId,
				createdAt: mockQuestion.createdAt.toISOString(),
				updatedAt: mockQuestion.updatedAt.toISOString(),
			});
		});

		it("should call repository with correct input", async () => {
			await useCase.execute(validInput);

			expect(mockRepository.create).toHaveBeenCalledWith({
				content: validInput.content,
				explanation: validInput.explanation,
				difficultyId: validInput.difficultyId,
				themeId: validInput.themeId,
				authorId: validInput.authorId,
				answers: validInput.answers,
				tagIds: undefined,
			});
		});

		it("should pass tagIds to repository when provided", async () => {
			const inputWithTags = { ...validInput, tagIds: ["tag-1", "tag-2"] };

			await useCase.execute(inputWithTags);

			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ tagIds: ["tag-1", "tag-2"] }),
			);
		});

		it("should throw InvalidAnswersCountError when answers count is less than 4", async () => {
			const invalidInput = {
				...validInput,
				answers: [
					{ content: "3", isCorrect: false },
					{ content: "4", isCorrect: true },
					{ content: "5", isCorrect: false },
				],
			};

			expect(useCase.execute(invalidInput)).rejects.toThrow(
				InvalidAnswersCountError,
			);
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		it("should throw InvalidAnswersCountError when answers count is greater than 4", async () => {
			const invalidInput = {
				...validInput,
				answers: [
					{ content: "3", isCorrect: false },
					{ content: "4", isCorrect: true },
					{ content: "5", isCorrect: false },
					{ content: "6", isCorrect: false },
					{ content: "7", isCorrect: false },
				],
			};

			expect(useCase.execute(invalidInput)).rejects.toThrow(
				InvalidAnswersCountError,
			);
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		it("should throw InvalidAnswersCountError when answers array is empty", async () => {
			const invalidInput = { ...validInput, answers: [] };

			expect(useCase.execute(invalidInput)).rejects.toThrow(
				InvalidAnswersCountError,
			);
		});

		it("should handle null explanation", async () => {
			const inputWithNullExplanation = { ...validInput, explanation: null };

			await useCase.execute(inputWithNullExplanation);

			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ explanation: null }),
			);
		});

		it("should propagate repository errors", async () => {
			const error = new Error("Database error");
			mockRepository.create = mock(() => Promise.reject(error));

			expect(useCase.execute(validInput)).rejects.toThrow("Database error");
		});
	});
});
