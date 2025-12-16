import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WordRotate } from "@/components/ui/word-rotate";

export function HeroSection() {
	return (
		<section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
			<div className="flex flex-col items-center text-center">
				<BlurFade delay={0.1} inView>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary text-sm">
						<Sparkles className="size-4" />
						<span>Challenge Your Knowledge</span>
					</div>
				</BlurFade>

				<BlurFade delay={0.2} inView>
					<h1 className="mb-4 font-bold text-5xl text-foreground tracking-tight md:text-7xl">
						The Ultimate
						<br />
						<span className="bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent">
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
						className="font-semibold text-2xl text-primary md:text-3xl"
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
						<ShimmerButton className="h-12 px-8 font-medium text-base">
							<span className="flex items-center gap-2">
								Start Playing
								<ArrowRight className="size-4" />
							</span>
						</ShimmerButton>
						<Link
							to="/login"
							className="flex h-12 items-center gap-2 rounded-full border border-border bg-background/50 px-8 font-medium text-base text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/10"
						>
							Sign In
						</Link>
					</div>
				</BlurFade>
			</div>
		</section>
	);
}
