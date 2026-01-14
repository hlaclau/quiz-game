import { describe, expect, it } from "bun:test";
import { Difficulty } from "../../../domain/entities/difficulty";

describe("Difficulty Entity", () => {
	const validProps = {
		id: "diff-123",
		name: "Easy",
		level: 1,
		color: "#4CAF50",
		createdAt: new Date("2024-01-01"),
	};

	describe("create", () => {
		it("should create a difficulty with all properties", () => {
			const difficulty = Difficulty.create(validProps);

			expect(difficulty.id).toBe(validProps.id);
			expect(difficulty.name).toBe(validProps.name);
			expect(difficulty.level).toBe(validProps.level);
			expect(difficulty.color).toBe(validProps.color);
			expect(difficulty.createdAt).toEqual(validProps.createdAt);
		});

		it("should create a difficulty with null color", () => {
			const difficulty = Difficulty.create({ ...validProps, color: null });

			expect(difficulty.color).toBeNull();
		});

		it("should handle different difficulty levels", () => {
			const easy = Difficulty.create({ ...validProps, level: 1 });
			const hard = Difficulty.create({ ...validProps, level: 5 });

			expect(easy.level).toBe(1);
			expect(hard.level).toBe(5);
		});
	});
});
