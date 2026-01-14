import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetQuestionByIdUseCase } from "../../../application/use-cases/get-question-by-id/get-question-by-id.use-case";
import { Answer } from "../../../domain/entities/answer";
import { Question } from "../../../domain/entities/question";
import type {
	IQuestionRepository,
	QuestionWithAnswers,
} from "../../../domain/interfaces/question-repository.interface";

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

	const mockAnswers = [
		Answer.create({
			id: "answer-1",
			content: "3",
			isCorrect: false,
			questionId: "question-123",
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: "answer-2",
			content: "4",
			isCorrect: true,
			questionId: "question-123",
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: "answer-3",
			content: "5",
			isCorrect: false,
			questionId: "question-123",
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: "answer-4",
			content: "6",
			isCorrect: false,
			questionId: "question-123",
			createdAt: new Date("2024-01-01"),
		}),
	];

	const mockQuestionWithAnswers: QuestionWithAnswers = {
		question: mockQuestion,
		answers: mockAnswers,
	};

	beforeEach(() => {
		mockRepository = {
			create: mock(() => Promise.resolve(mockQuestion)),
			findById: mock(() => Promise.resolve(mockQuestionWithAnswers)),
			findAll: mock(() => Promise.resolve({ data: [], total: 0 })),
			setQuestionValidation: mock(() => Promise.resolve(mockQuestion)),
		};
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
				answers: [
					{
						id: "answer-1",
						content: "3",
						isCorrect: false,
						createdAt: "2024-01-01T00:00:00.000Z",
					},
					{
						id: "answer-2",
						content: "4",
						isCorrect: true,
						createdAt: "2024-01-01T00:00:00.000Z",
					},
					{
						id: "answer-3",
						content: "5",
						isCorrect: false,
						createdAt: "2024-01-01T00:00:00.000Z",
					},
					{
						id: "answer-4",
						content: "6",
						isCorrect: false,
						createdAt: "2024-01-01T00:00:00.000Z",
					},
				],
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
				Promise.resolve({
					question: questionWithNullExplanation,
					answers: mockAnswers,
				}),
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
				id: "question-789",
				content: "What is 2 + 2?",
				explanation: "Basic math",
				difficultyId: "diff-1",
				themeId: "theme-1",
				authorId: "author-1",
				validated: false,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01"),
			});
			mockRepository.findById = mock(() =>
				Promise.resolve({
					question: unvalidatedQuestion,
					answers: mockAnswers,
				}),
			);

			const result = await useCase.execute({ id: "question-789" });

			expect(result.data?.validated).toBe(false);
		});

		it("should return answers with correct one marked", async () => {
			const result = await useCase.execute({ id: "question-123" });

			expect(result.data?.answers).toHaveLength(4);
			const correctAnswer = result.data?.answers.find((a) => a.isCorrect);
			expect(correctAnswer).toBeDefined();
			expect(correctAnswer?.content).toBe("4");
		});

		it("should map all answer fields correctly", async () => {
			const result = await useCase.execute({ id: "question-123" });

			const firstAnswer = result.data?.answers[0];
			expect(firstAnswer).toEqual({
				id: "answer-1",
				content: "3",
				isCorrect: false,
				createdAt: "2024-01-01T00:00:00.000Z",
			});
		});
	});
});
