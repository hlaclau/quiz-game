import { Link } from "@tanstack/react-router";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import type { ThemeDTO } from "@/lib/api";

interface ThemeCardProps {
	theme: ThemeDTO;
}

export function ThemeCard({ theme }: ThemeCardProps) {
	// Generate gradient colors based on theme color
	const baseColor = theme.color || "#8b5cf6";

	return (
		<MagicCard
			className="group relative cursor-pointer overflow-hidden rounded-2xl"
			gradientFrom={baseColor}
			gradientTo={`${baseColor}99`}
			gradientColor={`${baseColor}40`}
		>
			<Link
				to="/play/$themeId"
				params={{ themeId: theme.id }}
				className="relative block w-full p-6 text-left"
			>
				{/* Glow effect */}
				{theme.color && (
					<div
						className="absolute inset-0 opacity-5 transition-opacity duration-500 group-hover:opacity-15"
						style={{
							background: `radial-gradient(circle at top right, ${theme.color}, transparent 70%)`,
						}}
					/>
				)}

				<div className="relative z-10">
					<div className="mb-3 flex items-center gap-3">
						{theme.color && (
							<div
								className="size-3 animate-pulse rounded-full shadow-lg"
								style={{
									backgroundColor: theme.color,
									boxShadow: `0 0 12px ${theme.color}80`,
								}}
							/>
						)}
						<h3 className="font-semibold text-foreground text-lg transition-colors group-hover:text-primary">
							{theme.name}
						</h3>
					</div>
					{theme.description && (
						<p className="line-clamp-2 text-muted-foreground text-sm">
							{theme.description}
						</p>
					)}

					{/* Play indicator */}
					<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs opacity-0 transition-all duration-300 group-hover:opacity-100">
						<span className="inline-flex items-center gap-1.5">
							<span className="relative flex size-2">
								<span
									className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
									style={{ backgroundColor: baseColor }}
								/>
								<span
									className="relative inline-flex size-2 rounded-full"
									style={{ backgroundColor: baseColor }}
								/>
							</span>
							Start Quiz
						</span>
					</div>
				</div>

				{/* Border beam on hover */}
				<div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<BorderBeam
						size={120}
						duration={4}
						colorFrom={baseColor}
						colorTo={`${baseColor}66`}
					/>
				</div>
			</Link>
		</MagicCard>
	);
}
