import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function CTASection() {
	return (
		<section className="relative mx-auto max-w-6xl px-6 py-16">
			<BlurFade delay={0.1} inView>
				<div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-12 text-center backdrop-blur-sm">
					{/* Decorative elements */}
					<div className="-right-24 -top-24 absolute size-48 rounded-full bg-violet-500/20 blur-3xl" />
					<div className="-bottom-24 -left-24 absolute size-48 rounded-full bg-pink-500/20 blur-3xl" />

					<div className="relative">
						<h2 className="mb-4 font-bold text-3xl text-foreground md:text-4xl">
							Ready to Test Your Knowledge?
						</h2>
						<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
							Join thousands of players and start your quiz journey today. No
							credit card required.
						</p>
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
					</div>
				</div>
			</BlurFade>
		</section>
	);
}
