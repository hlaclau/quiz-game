import { createFileRoute } from "@tanstack/react-router";
import { ThemeList } from "@/components/theme-list";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-12">
			<div className="mb-10 text-center">
				<h1 className="mb-3 font-bold text-4xl text-white tracking-tight">
					Quiz Game
				</h1>
				<p className="text-lg text-white/60">
					Choose a theme and test your knowledge
				</p>
			</div>

			<section>
				<h2 className="mb-6 font-semibold text-xl text-white/80">
					Available Themes
				</h2>
				<ThemeList />
			</section>
		</div>
	);
}
