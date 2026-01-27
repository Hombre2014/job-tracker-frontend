import { config } from '@/lib/config';

export interface CompanySuggestion {
  name: string;
  domain: string;
  logo: string | null;
}

/**
 * Fetches company suggestions from Clearbit Autocomplete API
 * @param query - Company name search query
 * @returns Array of company suggestions
 */
export const fetchCompanySuggestions = async (
  query: string,
): Promise<CompanySuggestion[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${config.clearbit.autocompleteUrl}?query=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch company suggestions');
    }

    const data: CompanySuggestion[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company suggestions:', error);
    return [];
  }
};
