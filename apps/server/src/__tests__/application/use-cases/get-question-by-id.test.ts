import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetQuestionByIdUseCase } from "../../../application/use-cases/get-question-by-id/get-question-by-id.use-case";
import { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";

describe("GetQuestionByIdUseCase", () => {
	let useCase: GetQuestionByIdUseCase;
	let mockRepository: IQuestionRepository;

	const mockQuestion = Question.create({
		id: "question-123",
		content: "What is 2 + 2?",
		explanation: "Basic math",
		difficultyId: "diff-1",
		themeId: "theme-1",
		authorId: "author-1",
		validated: true,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	});

	beforeEach(() => {
		mockRepository = {
			findById: mock(() => Promise.resolve(mockQuestion)),
		} as IQuestionRepository;
		useCase = new GetQuestionByIdUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should return a question when found", async () => {
			const result = await useCase.execute({ id: "question-123" });

			expect(result.data).not.toBeNull();
			expect(result.data?.id).toBe("question-123");
		});

		it("should map question to DTO correctly", async () => {
			const result = await useCase.execute({ id: "question-123" });

			expect(result.data).toEqual({
				id: mockQuestion.id,
				content: mockQuestion.content,
				explanation: mockQuestion.explanation,
				difficultyId: mockQuestion.difficultyId,
				themeId: mockQuestion.themeId,
				authorId: mockQuestion.authorId,
				validated: mockQuestion.validated,
				createdAt: mockQuestion.createdAt.toISOString(),
				updatedAt: mockQuestion.updatedAt.toISOString(),
			});
		});

		it("should return null data when question not found", async () => {
			mockRepository.findById = mock(() => Promise.resolve(null));

			const result = await useCase.execute({ id: "non-existent-id" });

			expect(result.data).toBeNull();
		});

		it("should call repository with correct id", async () => {
			await useCase.execute({ id: "question-123" });

			expect(mockRepository.findById).toHaveBeenCalledWith("question-123");
		});

		it("should propagate repository errors", async () => {
			const error = new Error("Database error");
			mockRepository.findById = mock(() => Promise.reject(error));

			await expect(useCase.execute({ id: "question-123" })).rejects.toThrow(
				"Database error",
			);
		});

		it("should handle question with null explanation", async () => {
			const questionWithNullExplanation = Question.create({
				id: "question-456",
				content: "Test question",
				explanation: null,
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: false,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
			});
			mockRepository.findById = mock(() =>
				Promise.resolve(questionWithNullExplanation),
			);

			const result = await useCase.execute({ id: "question-456" });

			expect(result.data?.explanation).toBeNull();
		});

		it("should return validated status correctly", async () => {
			const result = await useCase.execute({ id: "question-123" });

			expect(result.data?.validated).toBe(true);
		});

		it("should return unvalidated status correctly", async () => {
			const unvalidatedQuestion = Question.create({
				...mockQuestion,
				id: "question-789",
				validated: false,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
			});
			mockRepository.findById = mock(() =>
				Promise.resolve(unvalidatedQuestion),
			);

			const result = await useCase.execute({ id: "question-789" });

			expect(result.data?.validated).toBe(false);
		});
	});
});
