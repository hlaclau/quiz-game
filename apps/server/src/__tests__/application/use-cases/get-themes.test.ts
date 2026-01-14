import { beforeEach, describe, expect, it, mock } from "bun:test";
import { GetThemesUseCase } from "../../../application/use-cases/get-themes/get-themes.use-case";
import { Theme } from "../../../domain/entities/theme";
import type { IThemeRepository } from "../../../domain/interfaces/theme-repository.interface";

describe("GetThemesUseCase", () => {
	let useCase: GetThemesUseCase;
	let mockRepository: IThemeRepository;

	const mockThemes = [
		Theme.create({
			id: "theme-1",
			name: "Science",
			description: "Science questions",
			color: "#4CAF50",
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01"),
		}),
		Theme.create({
			id: "theme-2",
			name: "History",
			description: "History questions",
			color: "#FF5722",
			createdAt: new Date("2024-01-02"),
			updatedAt: new Date("2024-01-02"),
		}),
	];

	beforeEach(() => {
		mockRepository = {
			findAll: mock(() => Promise.resolve(mockThemes)),
			findById: mock(() => Promise.resolve(null)),
		};
		useCase = new GetThemesUseCase(mockRepository);
	});

	describe("execute", () => {
		it("should return all themes with correct count", async () => {
			const result = await useCase.execute();

			expect(result.count).toBe(2);
			expect(result.data).toHaveLength(2);
		});

		it("should map themes to DTOs correctly", async () => {
			const result = await useCase.execute();

			expect(result.data[0]).toEqual({
				id: "theme-1",
				name: "Science",
				description: "Science questions",
				color: "#4CAF50",
				createdAt: mockThemes[0].createdAt.toISOString(),
				updatedAt: mockThemes[0].updatedAt.toISOString(),
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

		it("should handle themes with null description and color", async () => {
			const themesWithNulls = [
				Theme.create({
					id: "theme-3",
					name: "Sports",
					description: null,
					color: null,
					createdAt: new Date("2024-01-03"),
					updatedAt: new Date("2024-01-03"),
				}),
			];
			mockRepository.findAll = mock(() => Promise.resolve(themesWithNulls));

			const result = await useCase.execute();

			expect(result.data[0].description).toBeNull();
			expect(result.data[0].color).toBeNull();
		});
	});
});
