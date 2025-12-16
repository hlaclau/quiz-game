import { Brain, Trophy, Users, Zap } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";

export function StatsSection() {
	return (
		<BlurFade delay={0.5} inView>
			<div className="mx-auto max-w-6xl px-6">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
					<StatCard
						icon={<Brain className="size-5 text-chart-1" />}
						value={500}
						label="Questions"
						suffix="+"
					/>
					<StatCard
						icon={<Users className="size-5 text-chart-2" />}
						value={10}
						label="Active Players"
						suffix="K+"
					/>
					<StatCard
						icon={<Trophy className="size-5 text-chart-4" />}
						value={50}
						label="Challenges"
						suffix="+"
					/>
					<StatCard
						icon={<Zap className="size-5 text-chart-3" />}
						value={99}
						label="Uptime"
						suffix="%"
					/>
				</div>
			</div>
		</BlurFade>
	);
}

function StatCard({
	icon,
	value,
	label,
	suffix = "",
}: {
	icon: React.ReactNode;
	value: number;
	label: string;
	suffix?: string;
}) {
	return (
		<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80">
			<div className="mb-3 flex items-center gap-2">
				{icon}
				<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
					{label}
				</span>
			</div>
			<div className="font-bold text-3xl text-foreground">
				<NumberTicker value={value} />
				<span className="text-primary">{suffix}</span>
			</div>
		</div>
	);
}
