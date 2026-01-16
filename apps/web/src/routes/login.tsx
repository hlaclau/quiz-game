import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/auth";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignInForm />;
}
