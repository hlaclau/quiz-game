/**
 * Lightweight IoC Container
 * Provides dependency registration and resolution with type safety
 */
class Container {
	private factories = new Map<string, () => unknown>();
	private singletons = new Map<string, unknown>();

	/**
	 * Register a factory function for a dependency
	 * @param key - Unique identifier for the dependency
	 * @param factory - Factory function that creates the dependency
	 */
	register<T>(key: string, factory: () => T): void {
		this.factories.set(key, factory);
	}

	/**
	 * Register a singleton dependency
	 * @param key - Unique identifier for the dependency
	 * @param factory - Factory function that creates the dependency (called once)
	 */
	singleton<T>(key: string, factory: () => T): void {
		if (!this.singletons.has(key)) {
			this.singletons.set(key, factory());
		}
	}

	/**
	 * Resolve a dependency by key
	 * @param key - Unique identifier for the dependency
	 * @returns The resolved dependency instance
	 * @throws Error if the dependency is not registered
	 */
	resolve<T>(key: string): T {
		// Check if it's a singleton first
		if (this.singletons.has(key)) {
			return this.singletons.get(key) as T;
		}

		// Otherwise, use factory
		const factory = this.factories.get(key);
		if (!factory) {
			throw new Error(`Dependency "${key}" is not registered`);
		}

		return factory() as T;
	}

	/**
	 * Check if a dependency is registered
	 * @param key - Unique identifier for the dependency
	 * @returns True if the dependency is registered
	 */
	has(key: string): boolean {
		return this.factories.has(key) || this.singletons.has(key);
	}

	/**
	 * Clear all registered dependencies (useful for testing)
	 */
	clear(): void {
		this.factories.clear();
		this.singletons.clear();
	}
}

/**
 * Global container instance
 */
export const container = new Container();
