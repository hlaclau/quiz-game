import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetDifficultiesUseCase } from "../../../application/use-cases/get-difficulties/get-difficulties.use-case";
import { Difficulty } from "../../../domain/entities/difficulty";
import type { IDifficultyRepository } from "../../../domain/interfaces/difficulty-repository.interface";

describe("GetDifficultiesUseCase", () => {
	let useCase: GetDifficultiesUseCase;
	let mockRepository: IDifficultyRepository;

	const mockDifficulties = [
		Difficulty.create({
			id: "diff-1",
			name: "Easy",
			level: 1,
			color: "#4CAF50",
			createdAt: new Date("2024-01-01"),
		}),
		Difficulty.create({
			id: "diff-2",
			name: "Medium",
			level: 2,
			color: "#FF9800",
			createdAt: new Date("2024-01-02"),
		}),
		Difficulty.create({
			id: "diff-3",
			name: "Hard",
			level: 3,
			color: "#F44336",
			createdAt: new Date("2024-01-03"),
		}),
	];

	beforeEach(() => {
		mockRepository = {
			findAll: mock(() => Promise.resolve(mockDifficulties)),
			findById: mock(() => Promise.resolve(null)),
		};
		useCase = new GetDifficultiesUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should return all difficulties with correct count", async () => {
			const result = await useCase.execute();

			expect(result.count).toBe(3);
			expect(result.data).toHaveLength(3);
		});

		it("should map difficulties to DTOs correctly", async () => {
			const result = await useCase.execute();

			expect(result.data[0]).toEqual({
				id: "diff-1",
				name: "Easy",
				level: 1,
				color: "#4CAF50",
				createdAt: mockDifficulties[0].createdAt.toISOString(),
			});
		});

		it("should handle empty results", async () => {
			mockRepository.findAll = mock(() => Promise.resolve([]));

			const result = await useCase.execute();

			expect(result.count).toBe(0);
			expect(result.data).toEqual([]);
		});

		it("should call repository findAll", async () => {
			await useCase.execute();

			expect(mockRepository.findAll).toHaveBeenCalled();
		});

		it("should propagate repository errors", async () => {
			const error = new Error("Database error");
			mockRepository.findAll = mock(() => Promise.reject(error));

			await expect(useCase.execute()).rejects.toThrow("Database error");
		});

		it("should handle difficulty with null color", async () => {
			const difficultiesWithNullColor = [
				Difficulty.create({
					id: "diff-4",
					name: "Expert",
					level: 4,
					color: null,
					createdAt: new Date("2024-01-04"),
				}),
			];
			mockRepository.findAll = mock(() =>
				Promise.resolve(difficultiesWithNullColor),
			);

			const result = await useCase.execute();

			expect(result.data[0].color).toBeNull();
		});

		it("should preserve difficulty level ordering", async () => {
			const result = await useCase.execute();

			expect(result.data[0].level).toBe(1);
			expect(result.data[1].level).toBe(2);
			expect(result.data[2].level).toBe(3);
		});
	});
});
