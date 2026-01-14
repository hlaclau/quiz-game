import type { ThemeDTO } from "../../dtos/theme.dto";

/**
 * Output for GetThemes use case
 */
export interface GetThemesOutput {
	data: ThemeDTO[];
	count: number;
}
