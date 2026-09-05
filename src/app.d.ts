declare namespace App {
	interface Platform {
		env: Env;
		context: ExecutionContext;
		caches: CacheStorage & { default: Cache };
	}
}
