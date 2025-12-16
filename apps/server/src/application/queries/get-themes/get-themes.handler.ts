import type { IThemeRepository } from "../../../domain/interfaces/theme-repository.interface";
import type { GetThemesResponse } from "./get-themes.response";

/**
 * GetThemes Query Handler
 * CQRS Handler - retrieves all themes
 */
export class GetThemesHandler {
	constructor(private readonly themeRepository: IThemeRepository) {}

	async execute(): Promise<GetThemesResponse> {
		const themes = await this.themeRepository.findAll();
		const data = themes.map((theme) => theme.toJSON());

		return {
			data,
			count: data.length,
		};
	}
}
