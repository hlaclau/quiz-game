import { Link } from "@tanstack/react-router";
import UserMenu from "./user-menu";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
	] as const;

	return (
		<header className="border-border/50 border-b bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				<div className="flex items-center gap-8">
					<Link to="/" className="font-bold text-foreground text-xl">
						Quiz<span className="text-violet-500">App</span>
					</Link>
					<nav className="hidden gap-6 md:flex">
						{links.map(({ to, label }) => (
							<Link
								key={to}
								to={to}
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						))}
					</nav>
				</div>
				<UserMenu />
			</div>
		</header>
	);
}
