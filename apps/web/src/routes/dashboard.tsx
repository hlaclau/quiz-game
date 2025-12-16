import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) {
			throw redirect({
				to: "/login",
			});
		}
		return { session };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="font-bold text-3xl">Dashboard</h1>
			<p className="mt-4 text-muted-foreground">
				Welcome back, {session?.user.name}!
			</p>
		</div>
	);
}
