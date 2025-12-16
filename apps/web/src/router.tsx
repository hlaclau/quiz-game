import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

export const getRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {},
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	});
	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
