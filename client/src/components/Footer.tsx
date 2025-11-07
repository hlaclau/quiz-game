import { useEffect, useState } from 'react'

export function Footer() {
  const [healthStatus, setHealthStatus] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await fetch(`${apiUrl}/health`)
        setHealthStatus(response.status)
      } catch (error) {
        setHealthStatus(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>API Status:</span>
          {isLoading ? (
            <span className="text-muted-foreground">Checking...</span>
          ) : healthStatus === 200 ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              {healthStatus}
            </span>
          ) : (
            <span className="font-semibold text-red-600 dark:text-red-400">
              {healthStatus || 'Error'}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}

