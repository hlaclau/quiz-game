import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function CTASection() {
	return (
		<section className="relative mx-auto max-w-6xl px-6 py-16">
			<BlurFade delay={0.1} inView>
				<div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-chart-2/10 p-12 text-center backdrop-blur-sm">
					{/* Decorative elements */}
					<div className="-right-24 -top-24 absolute size-48 rounded-full bg-primary/20 blur-3xl" />
					<div className="-bottom-24 -left-24 absolute size-48 rounded-full bg-accent/20 blur-3xl" />

					<div className="relative">
						<h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl">
							Ready to Test Your Knowledge?
						</h2>
						<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
							Join thousands of players and start your quiz journey today. No
							credit card required.
						</p>
						<ShimmerButton className="h-14 px-10 font-medium text-lg">
							<span className="flex items-center gap-2">
								Get Started Free
								<ArrowRight className="size-5" />
							</span>
						</ShimmerButton>
					</div>
				</div>
			</BlurFade>
		</section>
	);
}
