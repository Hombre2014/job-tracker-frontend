// API Configuration
export const config = {
  brandfetch: {
    clientId: process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID || '',
  },
  clearbit: {
    autocompleteUrl: 'https://autocomplete.clearbit.com/v1/companies/suggest',
  },
} as const;
