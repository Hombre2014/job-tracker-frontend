import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CompanyAutocomplete from '../CompanyAutocomplete';
import * as hooks from '@/hooks/useCompanyAutocomplete';

// Mock the hook
vi.mock('@/hooks/useCompanyAutocomplete');

// Mock CompanyLogo to avoid text duplication (Logo vs Name)
vi.mock('@/components/CompanyLogo', () => ({
  CompanyLogo: () => <div data-testid="company-logo">Logo</div>
}));

describe('CompanyAutocomplete', () => {
    const mockOnChange = vi.fn();
    const mockOnSelect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock return
        (hooks.useCompanyAutocomplete as any).mockReturnValue({
            suggestions: [],
            isLoading: false,
            error: null
        });
    });

    // Wrapper to manage controlled state
    const TestWrapper = ({ initialValue = '' }) => {
        const [val, setVal] = React.useState(initialValue);
        return (
            <CompanyAutocomplete 
                value={val} 
                onChange={(v) => {
                    setVal(v);
                    mockOnChange(v);
                }} 
                onCompanySelect={mockOnSelect} 
            />
        );
    };

    it('renders input with placeholder', () => {
        render(<TestWrapper />);
        expect(screen.getByPlaceholderText('Search for a company...')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const user = userEvent.setup();
        render(<TestWrapper />);
        
        const input = screen.getByPlaceholderText('Search for a company...');
        await user.type(input, 'Test');
        
        expect(mockOnChange).toHaveBeenCalledWith('T'); // Called for each char
        expect(input).toHaveValue('Test');
    });

    it('shows suggestions when user types and data is available', async () => {
        const user = userEvent.setup();
        const mockSuggestions = [
            { name: 'Test Corp', domain: 'test.com', logo: null }
        ];
        
        render(<TestWrapper />);

        // Mock data ready for next render
        (hooks.useCompanyAutocomplete as any).mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            error: null
        });

        const input = screen.getByPlaceholderText('Search for a company...');
        
        // Typing triggers state update + re-render where hook returns data
        await user.type(input, 'Test');
        
        expect(await screen.findByText('Test Corp')).toBeInTheDocument();
        expect(screen.getByText('test.com')).toBeInTheDocument();
    });

    it('calls onCompanySelect when clicking a suggestion', async () => {
        const user = userEvent.setup();
        const mockSuggestions = [
            { name: 'Test Corp', domain: 'test.com', logo: null }
        ];
        
        render(<TestWrapper />);

        // Setup mock data
        (hooks.useCompanyAutocomplete as any).mockReturnValue({
            suggestions: mockSuggestions,
            isLoading: false,
            error: null
        });
        
        const input = screen.getByPlaceholderText('Search for a company...');
        await user.type(input, 'Test');

        const option = await screen.findByText('Test Corp');
        await user.click(option);

        // Wrapper's onChange should update to selected name
        expect(input).toHaveValue('Test Corp');
        expect(mockOnSelect).toHaveBeenCalledWith(mockSuggestions[0]);
    });

    it('shows error message when fetch fails', async () => {
        const user = userEvent.setup();
        
        render(<TestWrapper />);
        
        (hooks.useCompanyAutocomplete as any).mockReturnValue({
            suggestions: [],
            isLoading: false,
            error: 'Failed to fetch'
        });
        
        const input = screen.getByPlaceholderText('Search for a company...');
        await user.type(input, 'Err');

        expect(await screen.findByText('Failed to load suggestions. Please try again.')).toBeInTheDocument();
    });
    
    it('shows "No companies found" when suggestions are empty and value length >= 2', async () => {
        const user = userEvent.setup();
        // Keep empty suggestions throughout
        (hooks.useCompanyAutocomplete as any).mockReturnValue({
            suggestions: [],
            isLoading: false,
            error: null
        });

        render(<TestWrapper />);
        
        const input = screen.getByPlaceholderText('Search for a company...');
        await user.type(input, 'Unknown');

        expect(await screen.findByText('No companies found')).toBeInTheDocument();
    });
});
