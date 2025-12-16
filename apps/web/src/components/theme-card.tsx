import type { ThemeDTO } from "@/lib/api";

interface ThemeCardProps {
	theme: ThemeDTO;
}

export function ThemeCard({ theme }: ThemeCardProps) {
	return (
		<button
			type="button"
			className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
			style={{
				boxShadow: theme.color ? `0 0 40px -12px ${theme.color}40` : undefined,
			}}
		>
			{theme.color && (
				<div
					className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
					style={{
						background: `radial-gradient(circle at top right, ${theme.color}, transparent 70%)`,
					}}
				/>
			)}
			<div className="relative">
				<div className="mb-3 flex items-center gap-3">
					{theme.color && (
						<div
							className="size-3 rounded-full"
							style={{ backgroundColor: theme.color }}
						/>
					)}
					<h3 className="font-semibold text-lg text-white">{theme.name}</h3>
				</div>
				{theme.description && (
					<p className="text-sm text-white/60 line-clamp-2">
						{theme.description}
					</p>
				)}
			</div>
		</button>
	);
}
