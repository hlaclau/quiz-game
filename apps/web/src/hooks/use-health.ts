import { useQuery } from "@tanstack/react-query";

export function useHealth() {
	return useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/api/health`,
			);
			return response.status === 200;
		},
	});
}
