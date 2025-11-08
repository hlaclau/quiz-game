import { apiClient } from "@/lib/api/client";

export interface HealthRepository {
	checkHealth(): Promise<number>;
}

export class HealthRepositoryImpl implements HealthRepository {
	async checkHealth(): Promise<number> {
		return apiClient.getStatus("/health");
	}
}

export const healthRepository = new HealthRepositoryImpl();
