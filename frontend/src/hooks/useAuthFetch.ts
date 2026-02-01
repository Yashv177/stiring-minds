import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/types';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>() {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<{ data: T }>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await promise;
      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const err = error as Error & { details?: ApiError['details'] };
      setState((prev) => ({ ...prev, isLoading: false, error: err }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

