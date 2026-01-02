import type { ReactNode } from "react";
import { Loader } from "@/components/shared";
import { useAuth } from "@/lib/auth-provider";

type AuthGuardProps = {
	children: ReactNode;
	/** Content to show when not authenticated */
	fallback?: ReactNode;
	/** Show loader while checking auth status */
	showLoader?: boolean;
};

/**
 * Only renders children if user is authenticated
 *
 * @example
 * ```tsx
 * <Authenticated>
 *   <SecretContent />
 * </Authenticated>
 *
 * // With fallback
 * <Authenticated fallback={<p>Please sign in</p>}>
 *   <SecretContent />
 * </Authenticated>
 * ```
 */
export function Authenticated({
	children,
	fallback = null,
	showLoader = true,
}: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading && showLoader) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

/**
 * Only renders children if user is NOT authenticated
 *
 * @example
 * ```tsx
 * <Unauthenticated>
 *   <SignInButton />
 * </Unauthenticated>
 * ```
 */
export function Unauthenticated({
	children,
	fallback = null,
	showLoader = true,
}: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading && showLoader) {
		return <Loader />;
	}

	if (isAuthenticated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

type RoleGuardProps = AuthGuardProps & {
	/** Required role(s) - can be a single role or array */
	roles: string | string[];
	/** If true, user needs ALL roles. If false (default), user needs ANY role */
	requireAll?: boolean;
};

/**
 * Only renders children if user has the required role(s)
 *
 * @example
 * ```tsx
 * // Single role
 * <RequireRole roles="admin">
 *   <AdminPanel />
 * </RequireRole>
 *
 * // Any of these roles
 * <RequireRole roles={["admin", "moderator"]}>
 *   <ModTools />
 * </RequireRole>
 *
 * // Must have ALL roles
 * <RequireRole roles={["admin", "verified"]} requireAll>
 *   <SuperSecretPanel />
 * </RequireRole>
 * ```
 */
export function RequireRole({
	children,
	roles,
	requireAll = false,
	fallback = null,
	showLoader = true,
}: RoleGuardProps) {
	const { isAuthenticated, isLoading, hasRole, hasAnyRole } = useAuth();

	if (isLoading && showLoader) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <>{fallback}</>;
	}

	const roleArray = Array.isArray(roles) ? roles : [roles];

	const hasAccess = requireAll
		? roleArray.every((role) => hasRole(role))
		: hasAnyRole(roleArray);

	if (!hasAccess) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
