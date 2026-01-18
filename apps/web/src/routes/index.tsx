import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { ThemeList } from "@/components/quiz";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WordRotate } from "@/components/ui/word-rotate";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative">
			{/* Background particles */}
			<Particles
				className="-z-10 absolute inset-0"
				quantity={80}
				ease={80}
				color="#8b5cf6"
				size={0.5}
				staticity={40}
			/>

			{/* Hero Section */}
			<section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
				<div className="flex flex-col items-center text-center">
					<BlurFade delay={0.1} inView>
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
							<Sparkles className="size-4" />
							<span>Challenge Your Knowledge</span>
						</div>
					</BlurFade>

					<BlurFade delay={0.2} inView>
						<h1 className="mb-4 font-bold text-5xl text-foreground tracking-tight md:text-7xl">
							The Ultimate
							<br />
							<span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
								Quiz Experience
							</span>
						</h1>
					</BlurFade>

					<BlurFade delay={0.3} inView>
						<p className="mb-2 max-w-2xl text-lg text-muted-foreground md:text-xl">
							Test your knowledge across
						</p>
					</BlurFade>

					<BlurFade delay={0.35} inView>
						<WordRotate
							className="font-semibold text-2xl text-violet-400 md:text-3xl"
							words={[
								"Science & Technology",
								"History & Culture",
								"Sports & Entertainment",
								"Arts & Literature",
								"Geography & Nature",
							]}
						/>
					</BlurFade>

					<BlurFade delay={0.4} inView>
						<div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
							<Link to="/play">
								<ShimmerButton
									className="h-12 px-8 font-medium text-base"
									shimmerColor="#a855f7"
									background="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
								>
									<span className="flex items-center gap-2">
										Start Playing
										<ArrowRight className="size-4" />
									</span>
								</ShimmerButton>
							</Link>
							<Link
								to="/login"
								className="flex h-12 items-center gap-2 rounded-full border border-border bg-background/50 px-8 font-medium text-base text-foreground backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-violet-500/10"
							>
								Sign In
							</Link>
						</div>
					</BlurFade>
				</div>

				{/* Stats Section */}
				<BlurFade delay={0.5} inView>
					<div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
						<StatCard
							icon={<Brain className="size-5 text-violet-400" />}
							value={500}
							label="Questions"
							suffix="+"
						/>
						<StatCard
							icon={<Users className="size-5 text-fuchsia-400" />}
							value={10}
							label="Active Players"
							suffix="K+"
						/>
						<StatCard
							icon={<Trophy className="size-5 text-amber-400" />}
							value={50}
							label="Challenges"
							suffix="+"
						/>
						<StatCard
							icon={<Zap className="size-5 text-emerald-400" />}
							value={99}
							label="Uptime"
							suffix="%"
						/>
					</div>
				</BlurFade>
			</section>

			{/* Features Section */}
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

			{/* Themes Section */}
			<section className="relative mx-auto max-w-6xl px-6 py-16">
				<BlurFade delay={0.1} inView>
					<div className="mb-12 flex items-end justify-between">
						<div>
							<h2 className="mb-2 font-bold text-3xl text-foreground md:text-4xl">
								Pick Your Topic
							</h2>
							<p className="text-muted-foreground">
								Choose from our curated collection of quiz themes
							</p>
						</div>
						<Link
							to="/"
							className="hidden items-center gap-1 text-sm text-violet-400 transition-colors hover:text-violet-300 md:flex"
						>
							View all themes
							<ArrowRight className="size-4" />
						</Link>
					</div>
				</BlurFade>

				<BlurFade delay={0.2} inView>
					<ThemeList />
				</BlurFade>
			</section>

			{/* CTA Section */}
			<section className="relative mx-auto max-w-6xl px-6 py-16">
				<BlurFade delay={0.1} inView>
					<div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-12 text-center backdrop-blur-sm">
						{/* Decorative elements */}
						<div className="-top-24 -right-24 absolute size-48 rounded-full bg-violet-500/20 blur-3xl" />
						<div className="-bottom-24 -left-24 absolute size-48 rounded-full bg-pink-500/20 blur-3xl" />

						<div className="relative flex flex-col items-center">
							<h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl">
								Ready to Test Your Knowledge?
							</h2>
							<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
								Join thousands of players and start your quiz journey today. No
								credit card required.
							</p>
							<Link to="/play">
								<ShimmerButton
									className="h-14 px-10 font-medium text-lg"
									shimmerColor="#a855f7"
									background="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
								>
									<span className="flex items-center gap-2">
										Get Started Free
										<ArrowRight className="size-5" />
									</span>
								</ShimmerButton>
							</Link>
						</div>
					</div>
				</BlurFade>
			</section>
		</div>
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
		<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-card/80">
			<div className="mb-3 flex items-center gap-2">
				{icon}
				<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
					{label}
				</span>
			</div>
			<div className="font-bold text-3xl text-foreground">
				<NumberTicker value={value} />
				<span className="text-violet-400">{suffix}</span>
			</div>
		</div>
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
