import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetRandomQuestionsUseCase } from "../../../application/use-cases/get-random-question/get-random-question.use-case";
import { Answer } from "../../../domain/entities/answer";
import { Question } from "../../../domain/entities/question";
import type {
	IQuestionRepository,
	QuestionWithAnswers,
} from "../../../domain/interfaces/question-repository.interface";

describe("GetRandomQuestionsUseCase", () => {
	let useCase: GetRandomQuestionsUseCase;
	let mockRepository: IQuestionRepository;

	const createMockQuestion = (id: string) =>
		Question.create({
			id,
			content: `Question ${id}`,
			explanation: `Explanation for ${id}`,
			difficultyId: "diff-1",
			themeId: "theme-geography",
			authorId: "author-1",
			validated: true,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01"),
		});

	const createMockAnswers = (questionId: string) => [
		Answer.create({
			id: `${questionId}-answer-1`,
			content: "Answer 1",
			isCorrect: false,
			questionId,
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: `${questionId}-answer-2`,
			content: "Answer 2",
			isCorrect: true,
			questionId,
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: `${questionId}-answer-3`,
			content: "Answer 3",
			isCorrect: false,
			questionId,
			createdAt: new Date("2024-01-01"),
		}),
		Answer.create({
			id: `${questionId}-answer-4`,
			content: "Answer 4",
			isCorrect: false,
			questionId,
			createdAt: new Date("2024-01-01"),
		}),
	];

	const mockQuestionsWithAnswers: QuestionWithAnswers[] = [
		{ question: createMockQuestion("q1"), answers: createMockAnswers("q1") },
		{ question: createMockQuestion("q2"), answers: createMockAnswers("q2") },
		{ question: createMockQuestion("q3"), answers: createMockAnswers("q3") },
	];

	beforeEach(() => {
		mockRepository = {
			create: mock(() => Promise.resolve(createMockQuestion("q1"))),
			update: mock(() => Promise.resolve(null)),
			findById: mock(() =>
				Promise.resolve(mockQuestionsWithAnswers[0] ?? null),
			),
			findAll: mock(() => Promise.resolve({ data: [], total: 0 })),
			setQuestionValidation: mock(() => Promise.resolve(createMockQuestion("q1"))),
			findRandomByTheme: mock(() => Promise.resolve(mockQuestionsWithAnswers)),
		};
		useCase = new GetRandomQuestionsUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should return multiple random questions for the theme", async () => {
			const result = await useCase.execute({
				themeId: "theme-geography",
				limit: 10,
			});

			expect(result.data).toHaveLength(3);
			expect(result.data[0]?.id).toBe("q1");
			expect(result.data[1]?.id).toBe("q2");
			expect(result.data[2]?.id).toBe("q3");
		});

		it("should call repository with correct themeId and limit", async () => {
			await useCase.execute({ themeId: "theme-science", limit: 5 });

			expect(mockRepository.findRandomByTheme).toHaveBeenCalledWith(
				"theme-science",
				5,
				undefined,
			);
		});

		it("should return empty array when no questions found", async () => {
			mockRepository.findRandomByTheme = mock(() => Promise.resolve([]));
			useCase = new GetRandomQuestionsUseCase(mockRepository);

			const result = await useCase.execute({
				themeId: "theme-nonexistent",
				limit: 10,
			});

			expect(result.data).toEqual([]);
		});

		it("should map all questions to DTOs correctly", async () => {
			const result = await useCase.execute({
				themeId: "theme-geography",
				limit: 10,
			});

			expect(result.data[0]).toMatchObject({
				id: "q1",
				content: "Question q1",
				themeId: "theme-geography",
				validated: true,
			});
			expect(result.data[0]?.answers).toHaveLength(4);
		});

		it("should return unique questions (no duplicates)", async () => {
			const result = await useCase.execute({
				themeId: "theme-geography",
				limit: 10,
			});

			const ids = result.data.map((q) => q.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});
	});
});
