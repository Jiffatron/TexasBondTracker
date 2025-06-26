import { useEffect, useState } from 'react';

/**
 * Hook that automatically refreshes data in development mode
 * Useful for JSON files that don't trigger Vite's hot reload
 */
export function useAutoRefresh(intervalMs: number = 2000) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Only auto-refresh in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return refreshKey;
}

/**
 * Hook for fetching JSON data with auto-refresh in development
 */
export function useJsonData<T>(url: string, fallback: T[] = []) {
  const [data, setData] = useState<T[]>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshKey = useAutoRefresh(1000); // Refresh every 1 second in dev

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add timestamp to prevent caching in development
        const timestamp = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';
        const response = await fetch(`${url}${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(Array.isArray(jsonData) ? jsonData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading JSON data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [url, refreshKey]); // Refresh when refreshKey changes

  return { data, isLoading, error };
}
