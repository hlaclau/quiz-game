import type { ThemeDTO } from "../../dtos/theme.dto";

/**
 * GetThemes Query Response
 */
export interface GetThemesResponse {
	data: ThemeDTO[];
	count: number;
}
