import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ThemeList } from "@/components/quiz";
import { BlurFade } from "@/components/ui/blur-fade";

export function ThemesSection() {
	return (
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
						className="hidden items-center gap-1 text-primary text-sm transition-colors hover:text-primary/80 md:flex"
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
	);
}
