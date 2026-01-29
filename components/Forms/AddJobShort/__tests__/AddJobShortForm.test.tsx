import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddJobShortForm from '../AddJobShortForm';
import * as hooks from '@/redux/hooks';
import * as navigation from 'next/navigation';

// Mock the hooks
vi.mock('@/redux/hooks');
vi.mock('next/navigation');

// Mock child components that might be complex
vi.mock('@/components/CompanyAutocomplete', () => ({
  CompanyAutocomplete: ({ value, onChange }: any) => (
    <input
      data-testid="company-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search for a company..."
    />
  ),
}));

vi.mock('../ComboBoardListBox', async () => {
  const { forwardRef } = await import('react');
  return {
    default: forwardRef(({ value }: any, ref: any) => (
      <div ref={ref} data-testid="board-select">{value}</div>
    )),
  };
});

describe('AddJobShortForm', () => {
  const mockDispatch = vi.fn();
  const mockBoards = [
    {
      id: 'board-1',
      name: 'My Board',
      columns: [{ id: 'col-1', name: 'Wishlist' }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useAppDispatch as any).mockReturnValue(mockDispatch);
    (hooks.useAppSelector as any).mockReturnValue({ boards: mockBoards });
    (navigation.useParams as any).mockReturnValue({ board_id: 'board-1' });
    (navigation.useSearchParams as any).mockReturnValue({
      get: (key: string) => null,
    });
  });

  it('renders correctly with initial board data', () => {
    render(<AddJobShortForm columnOrder={0} />);

    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    
    const boardSelects = screen.getAllByTestId('board-select');
    expect(boardSelects[0]).toHaveTextContent('My Board');
  });

  it('pre-fills fields from URL parameters', () => {
    (navigation.useSearchParams as any).mockReturnValue({
      get: (key: string) => {
        if (key === 'company') return 'Apple';
        if (key === 'jobTitle') return 'Designer';
        return null;
      },
    });

    render(<AddJobShortForm columnOrder={0} />);

    const companyInput = screen.getByTestId('company-input');
    const titleInput = screen.getByPlaceholderText('Job Title');

    expect(companyInput).toHaveValue('Apple');
    expect(titleInput).toHaveValue('Designer');
  });

  it('updates input fields', () => {
    render(<AddJobShortForm columnOrder={0} />);

    const companyInput = screen.getByTestId('company-input');
    const titleInput = screen.getByPlaceholderText('Job Title');

    fireEvent.change(companyInput, { target: { value: 'Google' } });
    fireEvent.change(titleInput, { target: { value: 'Software Engineer' } });

    expect(companyInput).toHaveValue('Google');
    expect(titleInput).toHaveValue('Software Engineer');
  });

  it('validates form status callback', () => {
    const onValidationChange = vi.fn();
    render(<AddJobShortForm columnOrder={0} onValidationChange={onValidationChange} />);

    const companyInput = screen.getByTestId('company-input');
    const titleInput = screen.getByPlaceholderText('Job Title');

    // Initially invalid
    expect(onValidationChange).toHaveBeenCalledWith(false);

    // Still invalid
    fireEvent.change(companyInput, { target: { value: 'Google' } });
    expect(onValidationChange).toHaveBeenCalledWith(false);

    // Valid
    fireEvent.change(titleInput, { target: { value: 'Software Engineer' } });
    expect(onValidationChange).toHaveBeenCalledWith(true);
  });
});
