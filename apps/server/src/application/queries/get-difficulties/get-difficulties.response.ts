import type { DifficultyDTO } from "../../dtos/difficulty.dto";

/**
 * GetDifficulties Query Response
 */
export interface GetDifficultiesResponse {
	data: DifficultyDTO[];
	count: number;
}
