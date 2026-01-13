import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { Footer, Header } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-provider";
import appCss from "../index.css?url";

export type RouterAppContext = Record<string, never>;

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "QuizApp - Test Your Knowledge",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<div className="flex min-h-svh flex-col">
							<Header />
							<main className="flex-1">
								<Outlet />
							</main>
							<Footer />
						</div>
						<Toaster richColors />
					</AuthProvider>
				</ThemeProvider>
				<TanStackRouterDevtools position="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}
