import { useState, useEffect, useCallback } from 'react';
import {
  fetchCompanySuggestions,
  CompanySuggestion,
} from '@/services/companyAutocompleteService';

interface UseCompanyAutocompleteResult {
  suggestions: CompanySuggestion[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for company autocomplete functionality with debouncing
 * @param query - The search query
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns Suggestions, loading state, and error state
 */
export const useCompanyAutocomplete = (
  query: string,
  debounceMs: number = 300,
): UseCompanyAutocompleteResult => {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchCompanySuggestions(searchQuery);
      setSuggestions(results);
    } catch (err) {
      setError('Failed to fetch company suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs, fetchSuggestions]);

  return { suggestions, isLoading, error };
};
