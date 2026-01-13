import { Skeleton } from "@/components/ui/skeleton";
import { useThemes } from "@/hooks/use-themes";
import { ThemeCard } from "./theme-card";

export function ThemeList() {
	const { data, isLoading, error } = useThemes();

	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton list with fixed length
					<Skeleton key={i} className="h-32 rounded-2xl" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
				<p className="text-destructive">Failed to load themes</p>
			</div>
		);
	}

	if (!data?.data.length) {
		return (
			<div className="rounded-2xl border border-border bg-muted/50 p-6 text-center">
				<p className="text-muted-foreground">No themes available yet</p>
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
