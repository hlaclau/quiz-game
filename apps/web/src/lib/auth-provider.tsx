import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { authClient } from "./auth-client";

type User = {
	id: string;
	name: string;
	email: string;
	image: string | null | undefined;
	username: string | null | undefined;
	displayUsername: string | null | undefined;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
};

type Session = {
	user: User;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
	};
};

type AuthContextType = {
	/** The current user, or null if not authenticated */
	user: User | null;
	/** The full session object */
	session: Session | null;
	/** Whether the session is currently loading */
	isLoading: boolean;
	/** Whether the user is authenticated */
	isAuthenticated: boolean;
	/** Sign out the current user */
	signOut: () => Promise<void>;
	/** Refresh the session */
	refresh: () => void;
	// Role-based helpers (ready for future use)
	/** Check if user has a specific role */
	hasRole: (role: string) => boolean;
	/** Check if user has any of the specified roles */
	hasAnyRole: (roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, isPending, refetch } = authClient.useSession();

	const user = data?.user ?? null;
	const session = data ?? null;
	const isAuthenticated = !!user;

	const signOut = useCallback(async () => {
		await authClient.signOut();
	}, []);

	const refresh = useCallback(() => {
		refetch();
	}, [refetch]);

	// Role helpers - ready for when you add roles
	const hasRole = useCallback(
		(_role: string) => {
			if (!user) return false;
			// When you add roles, update this:
			// return user.role === _role;
			return false;
		},
		[user],
	);

	const hasAnyRole = useCallback(
		(_roles: string[]) => {
			if (!user) return false;
			// When you add roles, update this:
			// return _roles.includes(user.role);
			return false;
		},
		[user],
	);

	const value = useMemo<AuthContextType>(
		() => ({
			user,
			session,
			isLoading: isPending,
			isAuthenticated,
			signOut,
			refresh,
			hasRole,
			hasAnyRole,
		}),
		[
			user,
			session,
			isPending,
			isAuthenticated,
			signOut,
			refresh,
			hasRole,
			hasAnyRole,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication state and helpers
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <p>Please sign in</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user.name}!</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

/**
 * Hook that throws if user is not authenticated
 * Use this when you're certain the user must be logged in
 *
 * @example
 * ```tsx
 * function ProtectedComponent() {
 *   const { user } = useRequireAuth();
 *   // user is guaranteed to exist here
 *   return <p>Hello {user.name}</p>;
 * }
 * ```
 */
export function useRequireAuth() {
	const auth = useAuth();
	if (!auth.isAuthenticated || !auth.user || !auth.session) {
		throw new Error("User must be authenticated");
	}
	return { ...auth, user: auth.user, session: auth.session };
}
