import { Brain, Trophy, Zap } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

export function FeaturesSection() {
	return (
		<section className="relative mx-auto max-w-6xl px-6 py-16">
			<BlurFade delay={0.1} inView>
				<div className="mb-12 text-center">
					<h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl">
						Why Players Love Us
					</h2>
					<p className="text-muted-foreground">
						Experience quizzing like never before
					</p>
				</div>
			</BlurFade>

			<div className="grid gap-6 md:grid-cols-3">
				<BlurFade delay={0.15} inView>
					<FeatureCard
						icon={<Zap className="size-6" />}
						title="Lightning Fast"
						description="Real-time responses and instant feedback on every answer"
						gradient="from-amber-500 to-orange-500"
					/>
				</BlurFade>
				<BlurFade delay={0.2} inView>
					<FeatureCard
						icon={<Brain className="size-6" />}
						title="Smart Learning"
						description="Adaptive difficulty that grows with your knowledge"
						gradient="from-violet-500 to-purple-500"
					/>
				</BlurFade>
				<BlurFade delay={0.25} inView>
					<FeatureCard
						icon={<Trophy className="size-6" />}
						title="Compete & Win"
						description="Climb leaderboards and earn achievements"
						gradient="from-emerald-500 to-teal-500"
					/>
				</BlurFade>
			</div>
		</section>
	);
}

function FeatureCard({
	icon,
	title,
	description,
	gradient,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	gradient: string;
}) {
	return (
		<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-card/80">
			{/* Icon */}
			<div
				className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}
			>
				{icon}
			</div>

			<h3 className="mb-2 font-semibold text-foreground text-xl">{title}</h3>
			<p className="text-muted-foreground">{description}</p>

			{/* Hover glow */}
			<div
				className={`-bottom-20 -right-20 absolute size-40 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
			/>
		</div>
	);
}
