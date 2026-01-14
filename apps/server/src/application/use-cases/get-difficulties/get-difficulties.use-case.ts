import type { Difficulty } from "../../../domain/entities/difficulty";
import type { IDifficultyRepository } from "../../../domain/interfaces/difficulty-repository.interface";
import type { DifficultyDTO } from "../../dtos/difficulty.dto";
import type { GetDifficultiesOutput } from "./get-difficulties.types";

/**
 * Maps a Difficulty entity to a DifficultyDTO
 */
function toDTO(difficulty: Difficulty): DifficultyDTO {
	return {
		id: difficulty.id,
		name: difficulty.name,
		level: difficulty.level,
		color: difficulty.color,
		createdAt: difficulty.createdAt.toISOString(),
	};
}

/**
 * GetDifficulties Use Case
 * Retrieves all available difficulties
 */
export class GetDifficultiesUseCase {
	constructor(private readonly difficultyRepository: IDifficultyRepository) {}

	async execute(): Promise<GetDifficultiesOutput> {
		const difficulties = await this.difficultyRepository.findAll();
		const data = difficulties.map(toDTO);

		return {
			data,
			count: data.length,
		};
	}
}
