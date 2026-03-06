import client from '@/api/client';
import axios from 'axios';

export interface DomainValidationResult {
  exists: boolean;
  name?: string;
  logo?: string;
  domain?: string;
}

export interface FindCompanyParams {
  name?: string;
  domain?: string;
}

/**
 * Validate domain against Brandfetch API via backend
 */
export const validateDomain = async (domain: string) => {
  try {
    const response = await client.post(
      '/companies/validate-domain',
      { domain },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error validating domain:', error);
    return { exists: false };
  }
};

/**
 * Find existing company by name or domain
 */
export const findCompanyByNameOrDomain = async (params: FindCompanyParams): Promise<any | null> => {
  try {
    const response = await client.post('/companies/find-by-name-or-domain', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error finding company:', error);
    return null;
  }
};
