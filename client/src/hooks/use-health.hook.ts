import { useQuery } from "@tanstack/react-query";
import { healthRepository } from "@/repositories/health.repository";

export function useHealth() {
	return useQuery({
		queryKey: ["health"],
		queryFn: () => healthRepository.checkHealth(),
		refetchInterval: 30000,
		retry: 1,
	});
}
