import { useHealth } from '@/hooks/use-health.hook'

export function Footer() {
  const { data: healthStatus, isLoading, isError } = useHealth()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>API Status:</span>
          {isLoading ? (
            <span className="text-muted-foreground">Checking...</span>
          ) : isError || healthStatus !== 200 ? (
            <span className="font-semibold text-red-600 dark:text-red-400">
              {healthStatus || 'Error'}
            </span>
          ) : (
            <span className="font-semibold text-green-600 dark:text-green-400">
              {healthStatus}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}

