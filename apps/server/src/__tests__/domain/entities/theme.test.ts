import { describe, expect, it } from "bun:test";
import { Theme } from "../../../domain/entities/theme";

describe("Theme Entity", () => {
	const validProps = {
		id: "theme-123",
		name: "Science",
		description: "Questions about science",
		color: "#4CAF50",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-02"),
	};

	describe("create", () => {
		it("should create a theme with all properties", () => {
			const theme = Theme.create(validProps);

			expect(theme.id).toBe(validProps.id);
			expect(theme.name).toBe(validProps.name);
			expect(theme.description).toBe(validProps.description);
			expect(theme.color).toBe(validProps.color);
			expect(theme.createdAt).toEqual(validProps.createdAt);
			expect(theme.updatedAt).toEqual(validProps.updatedAt);
		});

		it("should create a theme with null description and color", () => {
			const theme = Theme.create({
				...validProps,
				description: null,
				color: null,
			});

			expect(theme.description).toBeNull();
			expect(theme.color).toBeNull();
		});
	});
});
