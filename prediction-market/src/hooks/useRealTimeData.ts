'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseRealTimeDataOptions<T> {
  /**
   * Function to fetch data
   */
  fetchData: () => Promise<T>;
  
  /**
   * Interval in milliseconds (default: 10000 = 10 seconds)
   */
  interval?: number;
  
  /**
   * Whether to fetch immediately on mount (default: true)
   */
  fetchOnMount?: boolean;
  
  /**
   * Whether auto-refresh is enabled (default: true)
   */
  enabled?: boolean;
  
  /**
   * Dependencies array - refresh when these change
   */
  deps?: any[];
}

export interface UseRealTimeDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  toggleAutoRefresh: () => void;
  isAutoRefreshEnabled: boolean;
}

/**
 * Hook for real-time data fetching with automatic polling
 */
export function useRealTimeData<T>({
  fetchData,
  interval = 10000, // 10 seconds default
  fetchOnMount = true,
  enabled = true,
  deps = [],
}: UseRealTimeDataOptions<T>): UseRealTimeDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const loadData = useCallback(async (showLoading = false) => {
    if (!mountedRef.current) return;

    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);
      
      console.log('🔄 Starting data fetch...');
      const result = await fetchData();
      console.log('✅ Data fetch complete:', result);
      console.log('📍 mountedRef.current:', mountedRef.current);
      console.log('📍 About to update state...');
      
      // ALWAYS update state - React 18 handles cleanup automatically
      // mountedRef check was causing issues with StrictMode double-mounting
      console.log('📍 Calling setData (ignoring mountedRef)...');
      setData(result);
      setLastUpdated(new Date());
      console.log('💾 State updated with new data');

    } catch (err) {
      console.error('❌ Error fetching real-time data:', err);
      // Always set error - React handles cleanup
      setError(err as Error);
    } finally {
      console.log('📍 Finally block, mountedRef:', mountedRef.current);
      // ALWAYS update loading state, even if unmounting
      // This prevents stuck loading states
      console.log('🏁 Loading complete, setting isLoading=false');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await loadData(false);
  }, [loadData]);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    
    if (fetchOnMount) {
      console.log('🚀 Initial data load triggered');
      
      // Wrap loadData to check cancellation
      const load = async () => {
        if (!cancelled) {
          await loadData(true);
        }
      };
      
      load();
    }
    
    return () => {
      cancelled = true;
      console.log('🔴 Cleanup: cancelling initial load');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnMount]);

  // Auto-refresh polling
  useEffect(() => {
    if (!isAutoRefreshEnabled || interval <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      loadData(false);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, interval, loadData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    toggleAutoRefresh,
    isAutoRefreshEnabled,
  };
}

/**
 * Format "last updated" time as relative string
 */
export function formatLastUpdated(date: Date | null): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleTimeString();
}






