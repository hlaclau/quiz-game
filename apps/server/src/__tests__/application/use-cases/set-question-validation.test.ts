import { beforeEach, describe, expect, it, mock } from "bun:test";
import { SetQuestionValidationUseCase } from "../../../application/use-cases/validate-question/validate-question.use-case";
import { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";

describe("SetQuestionValidationUseCase", () => {
	let useCase: SetQuestionValidationUseCase;
	let mockRepository: IQuestionRepository;

	const createMockQuestion = (validated: boolean) =>
		Question.create({
			id: "question-123",
			content: "What is 2 + 2?",
			explanation: "Basic math",
			difficultyId: "diff-1",
			themeId: "theme-1",
			authorId: "author-1",
			validated,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-02"),
		});

	beforeEach(() => {
		mockRepository = {
			create: mock(() => Promise.resolve(createMockQuestion(false))),
			update: mock(() => Promise.resolve(null)),
			findById: mock(() => Promise.resolve(null)),
			findAll: mock(() => Promise.resolve({ data: [], total: 0 })),
			setQuestionValidation: mock(() =>
				Promise.resolve(createMockQuestion(true)),
			),
			findRandomByTheme: mock(() => Promise.resolve([])),
		};
		useCase = new SetQuestionValidationUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should validate a question successfully", async () => {
			const result = await useCase.execute({
				id: "question-123",
				validated: true,
			});

			expect(result.data).not.toBeNull();
			expect(result.data?.validated).toBe(true);
		});

		it("should unvalidate a question successfully", async () => {
			mockRepository.setQuestionValidation = mock(() =>
				Promise.resolve(createMockQuestion(false)),
			);

			const result = await useCase.execute({
				id: "question-123",
				validated: false,
			});

			expect(result.data).not.toBeNull();
			expect(result.data?.validated).toBe(false);
		});

		it("should return null when question not found", async () => {
			mockRepository.setQuestionValidation = mock(() => Promise.resolve(null));

			const result = await useCase.execute({
				id: "non-existent-id",
				validated: true,
			});

			expect(result.data).toBeNull();
		});

		it("should call repository with correct id and validated value", async () => {
			await useCase.execute({ id: "question-123", validated: true });

			expect(mockRepository.setQuestionValidation).toHaveBeenCalledWith(
				"question-123",
				true,
			);
		});

		it("should call repository with validated=false when unvalidating", async () => {
			await useCase.execute({ id: "question-123", validated: false });

			expect(mockRepository.setQuestionValidation).toHaveBeenCalledWith(
				"question-123",
				false,
			);
		});

		it("should map question to DTO correctly", async () => {
			const result = await useCase.execute({
				id: "question-123",
				validated: true,
			});

			expect(result.data).toEqual({
				id: "question-123",
				content: "What is 2 + 2?",
				explanation: "Basic math",
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: true,
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-02T00:00:00.000Z",
			});
		});

		it("should propagate repository errors", async () => {
			const error = new Error("Database error");
			mockRepository.setQuestionValidation = mock(() => Promise.reject(error));

			await expect(
				useCase.execute({ id: "question-123", validated: true }),
			).rejects.toThrow("Database error");
		});

		it("should handle question with null explanation", async () => {
			const questionWithNullExplanation = Question.create({
				id: "question-456",
				content: "Test question",
				explanation: null,
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: true,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
			});
			mockRepository.setQuestionValidation = mock(() =>
				Promise.resolve(questionWithNullExplanation),
			);

			const result = await useCase.execute({
				id: "question-456",
				validated: true,
			});

			expect(result.data?.explanation).toBeNull();
		});
	});
});
