import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetQuestionsUseCase } from "../../../application/use-cases/get-questions/get-questions.use-case";
import { Question } from "../../../domain/entities/question";
import type { IQuestionRepository } from "../../../domain/interfaces/question-repository.interface";

describe("GetQuestionsUseCase", () => {
	let useCase: GetQuestionsUseCase;
	let mockRepository: IQuestionRepository;

	const mockQuestion1 = Question.create({
		id: "question-1",
		content: "What is 2 + 2?",
		explanation: "Basic math",
		difficultyId: "diff-1",
		themeId: "theme-1",
		authorId: "author-1",
		validated: true,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	});

	const mockQuestion2 = Question.create({
		id: "question-2",
		content: "What is the capital of France?",
		explanation: "Geography",
		difficultyId: "diff-2",
		themeId: "theme-2",
		authorId: "author-1",
		validated: false,
		createdAt: new Date("2024-01-02"),
		updatedAt: new Date("2024-01-02"),
	});

	const mockQuestions = [mockQuestion1, mockQuestion2];

	beforeEach(() => {
		mockRepository = {
			findAll: mock(() => Promise.resolve({ data: mockQuestions, total: 2 })),
		} as IQuestionRepository;
		useCase = new GetQuestionsUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should return paginated questions", async () => {
			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.data).toHaveLength(2);
			expect(result.total).toBe(2);
			expect(result.page).toBe(1);
			expect(result.limit).toBe(10);
		});

		it("should calculate totalPages correctly", async () => {
			mockRepository.findAll = mock(() =>
				Promise.resolve({ data: mockQuestions, total: 25 }),
			);

			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.totalPages).toBe(3);
		});

		it("should calculate totalPages as 1 when total equals limit", async () => {
			mockRepository.findAll = mock(() =>
				Promise.resolve({ data: mockQuestions, total: 10 }),
			);

			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.totalPages).toBe(1);
		});

		it("should map questions to DTOs correctly", async () => {
			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.data[0]).toEqual({
				id: "question-1",
				content: "What is 2 + 2?",
				explanation: "Basic math",
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: true,
				createdAt: mockQuestion1.createdAt.toISOString(),
				updatedAt: mockQuestion1.updatedAt.toISOString(),
			});
		});

		it("should include validated field in DTO", async () => {
			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.data[0]?.validated).toBe(true);
			expect(result.data[1]?.validated).toBe(false);
		});

		it("should handle empty results", async () => {
			mockRepository.findAll = mock(() =>
				Promise.resolve({ data: [], total: 0 }),
			);

			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.data).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.totalPages).toBe(0);
		});

		it("should pass themeId filter to repository", async () => {
			await useCase.execute({ page: 1, limit: 10, themeId: "theme-1" });

			expect(mockRepository.findAll).toHaveBeenCalledWith(
				{ themeId: "theme-1" },
				{ page: 1, limit: 10 },
			);
		});

		it("should pass undefined themeId when not provided", async () => {
			await useCase.execute({ page: 1, limit: 10 });

			expect(mockRepository.findAll).toHaveBeenCalledWith(
				{ themeId: undefined },
				{ page: 1, limit: 10 },
			);
		});

		it("should pass pagination options to repository", async () => {
			await useCase.execute({ page: 3, limit: 20 });

			expect(mockRepository.findAll).toHaveBeenCalledWith(
				{ themeId: undefined },
				{ page: 3, limit: 20 },
			);
		});

		it("should propagate repository errors", async () => {
			const error = new Error("Database error");
			mockRepository.findAll = mock(() => Promise.reject(error));

			await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow(
				"Database error",
			);
		});

		it("should handle questions with null explanation", async () => {
			const questionWithNullExplanation = Question.create({
				id: "question-3",
				content: "Test question",
				explanation: null,
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: false,
				createdAt: new Date("2024-01-03"),
				updatedAt: new Date("2024-01-03"),
			});
			mockRepository.findAll = mock(() =>
				Promise.resolve({ data: [questionWithNullExplanation], total: 1 }),
			);

			const result = await useCase.execute({ page: 1, limit: 10 });

			expect(result.data[0]?.explanation).toBeNull();
		});
	});
});
