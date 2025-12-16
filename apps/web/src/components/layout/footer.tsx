import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const footerLinks = {
	product: [
		{ label: "Features", to: "/" },
		{ label: "Themes", to: "/" },
		{ label: "Leaderboard", to: "/" },
	],
	company: [
		{ label: "About", to: "/" },
		{ label: "Contact", to: "/" },
	],
};

export function Footer() {
	return (
		<footer className="border-border/40 border-t bg-background/50 backdrop-blur-sm">
			<div className="mx-auto max-w-6xl px-6 py-12">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="sm:col-span-2">
						<Link to="/" className="mb-4 inline-flex items-center gap-1.5">
							<div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-sm text-white shadow-lg shadow-violet-500/25">
								Q
							</div>
							<span className="font-bold text-foreground text-xl">
								Quiz<span className="text-violet-500">App</span>
							</span>
						</Link>
						<p className="max-w-xs text-muted-foreground text-sm">
							Challenge your knowledge, compete with friends, and become the
							ultimate quiz champion.
						</p>
					</div>

					{/* Product Links */}
					<div>
						<h3 className="mb-3 font-semibold text-foreground text-sm">
							Product
						</h3>
						<ul className="space-y-2">
							{footerLinks.product.map(({ label, to }) => (
								<li key={label}>
									<Link
										to={to}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="mb-3 font-semibold text-foreground text-sm">
							Company
						</h3>
						<ul className="space-y-2">
							{footerLinks.company.map(({ label, to }) => (
								<li key={label}>
									<Link
										to={to}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-border/40 border-t pt-8 md:flex-row">
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} QuizApp. All rights reserved.
					</p>
					<p className="flex items-center gap-1 text-muted-foreground text-sm">
						Made with <Heart className="size-3.5 fill-red-500 text-red-500" />{" "}
						by Ynov Students
					</p>
				</div>
			</div>
		</footer>
	);
}
