import { createFileRoute } from "@tanstack/react-router";
import { useHealth } from "@/hooks/use-health";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { data: isHealthy, isLoading } = useHealth();

	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<h1 className="font-bold text-2xl">Quiz App</h1>
			<div className="flex items-center gap-2">
				<span>API Status:</span>
				{isLoading ? (
					<span className="text-yellow-500">Checking...</span>
				) : isHealthy ? (
					<span className="text-green-500">✓ Healthy (200)</span>
				) : (
					<span className="text-red-500">✗ Unhealthy</span>
				)}
			</div>
		</div>
	);
}
