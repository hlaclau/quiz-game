import { createFileRoute } from "@tanstack/react-router";
import { ThemeList } from "@/components/quiz";
import { BlurFade } from "@/components/ui/blur-fade";

export const Route = createFileRoute("/play/")({
	component: PlayComponent,
});

function PlayComponent() {
	return (
		<div className="relative min-h-screen px-6 py-20">
			<div className="mx-auto max-w-6xl">
				<BlurFade delay={0.1} inView>
					<div className="mb-12 text-center">
						<h1 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">
							Choose Your Theme
						</h1>
						<p className="text-lg text-muted-foreground">
							Select a topic to start your quiz journey
						</p>
					</div>
				</BlurFade>

				<BlurFade delay={0.2} inView>
					<ThemeList />
				</BlurFade>
			</div>
		</div>
	);
}
