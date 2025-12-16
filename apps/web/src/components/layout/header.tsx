"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import UserMenu from "./user-menu";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/dashboard", label: "Dashboard" },
] as const;

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	return (
		<header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				{/* Logo & Nav */}
				<div className="flex items-center gap-8">
					<Link
						to="/"
						className="group flex items-center gap-1.5 font-bold text-xl"
					>
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm shadow-lg shadow-primary/25 transition-shadow group-hover:shadow-primary/40">
							Q
						</div>
						<span className="text-foreground">
							Quiz<span className="text-primary">App</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-1 md:flex">
						{links.map(({ to, label }) => {
							const isActive = location.pathname === to;
							return (
								<Link
									key={to}
									to={to}
									className={cn(
										"rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{label}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-2">
					<ThemeToggle />

					<div className="hidden md:block">
						<UserMenu />
					</div>

					{/* Mobile menu button */}
					<Button
						variant="ghost"
						size="icon"
						className="size-9 md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="size-5" />
						) : (
							<Menu className="size-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
					<nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
						{links.map(({ to, label }) => {
							const isActive = location.pathname === to;
							return (
								<Link
									key={to}
									to={to}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										"rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
										isActive
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)}
								>
									{label}
								</Link>
							);
						})}
						<div className="mt-2 border-t border-border/40 pt-4">
							<UserMenu />
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
