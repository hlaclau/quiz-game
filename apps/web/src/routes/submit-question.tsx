import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/submit-question")({
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
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="font-bold text-3xl">Submit a Question</h1>
			<p className="mt-4 text-muted-foreground">
				Question submission form coming soon...
			</p>
		</div>
	);
}
