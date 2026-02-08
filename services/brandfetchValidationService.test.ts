import { describe, it, expect, vi, beforeEach } from 'vitest';
import client from '@/api/client';
import { validateDomain, findCompanyByNameOrDomain } from './brandfetchValidationService';

// Mock the API client
vi.mock('@/api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('brandfetchValidationService', () => {
  const mockAccessToken = 'mock-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateDomain', () => {
    it('calls the correct endpoint and returns data on success', async () => {
      const mockResponse = { data: { exists: true, name: 'Test Inc' } };
      (client.post as any).mockResolvedValue(mockResponse);

      const result = await validateDomain('test.com', mockAccessToken);

      expect(client.post).toHaveBeenCalledWith(
        '/companies/validate-domain',
        { domain: 'test.com' },
        {
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('returns { exists: false } on error', async () => {
      (client.post as any).mockRejectedValue(new Error('Network error'));

      const result = await validateDomain('test.com', mockAccessToken);

      expect(result).toEqual({ exists: false });
    });
  });

  describe('findCompanyByNameOrDomain', () => {
    it('calls the correct endpoint and returns data on success', async () => {
      const mockResponse = { data: { id: '123', name: 'Test Inc' } };
      (client.post as any).mockResolvedValue(mockResponse);

      const params = { name: 'Test', domain: 'test.com' };
      const result = await findCompanyByNameOrDomain(params, mockAccessToken);

      expect(client.post).toHaveBeenCalledWith(
        '/companies/find-by-name-or-domain',
        params,
        {
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('returns null on error', async () => {
      (client.post as any).mockRejectedValue(new Error('Network error'));

      const params = { name: 'Test' };
      const result = await findCompanyByNameOrDomain(params, mockAccessToken);

      expect(result).toBeNull();
    });
  });
});
