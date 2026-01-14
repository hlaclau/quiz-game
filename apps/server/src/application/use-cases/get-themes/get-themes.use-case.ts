import type { Theme } from "../../../domain/entities/theme";
import type { IThemeRepository } from "../../../domain/interfaces/theme-repository.interface";
import type { ThemeDTO } from "../../dtos/theme.dto";
import type { GetThemesOutput } from "./get-themes.types";

/**
 * Maps a Theme entity to a ThemeDTO
 */
function toDTO(theme: Theme): ThemeDTO {
	return {
		id: theme.id,
		name: theme.name,
		description: theme.description,
		color: theme.color,
		createdAt: theme.createdAt.toISOString(),
		updatedAt: theme.updatedAt.toISOString(),
	};
}

/**
 * GetThemes Use Case
 * Retrieves all available themes
 */
export class GetThemesUseCase {
	constructor(private readonly themeRepository: IThemeRepository) {}

	async execute(): Promise<GetThemesOutput> {
		const themes = await this.themeRepository.findAll();
		const data = themes.map(toDTO);

		return {
			data,
			count: data.length,
		};
	}
}
