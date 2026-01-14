import type { DifficultyDTO } from "../../dtos/difficulty.dto";

/**
 * Output for GetDifficulties use case
 */
export interface GetDifficultiesOutput {
	data: DifficultyDTO[];
	count: number;
}
