import { Skeleton } from "@/components/ui/skeleton";
import { useThemes } from "@/hooks/use-themes";
import { ThemeCard } from "./theme-card";

export function ThemeList() {
	const { data, isLoading, error } = useThemes();

	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-32 rounded-2xl" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
				<p className="text-red-400">Failed to load themes</p>
			</div>
		);
	}

	if (!data?.data.length) {
		return (
			<div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
				<p className="text-white/60">No themes available yet</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{data.data.map((theme) => (
				<ThemeCard key={theme.id} theme={theme} />
			))}
		</div>
	);
}
