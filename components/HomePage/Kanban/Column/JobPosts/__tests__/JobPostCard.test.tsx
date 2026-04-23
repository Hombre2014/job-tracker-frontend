import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobPostCard from '../JobPostCard';
import * as navigation from 'next/navigation';
import * as reduxHooks from '@/redux/hooks';

// Mock dependencies
vi.mock('@/redux/hooks');
vi.mock('next/navigation');
vi.mock('@/redux/jobs/jobsThunk');

// Mock CompanyLogo
vi.mock('@/components/CompanyLogo', () => ({
    CompanyLogo: ({ companyName }: any) => <div data-testid="company-logo">{companyName}</div>,
}));

// Mock UI components if necessary (AlertDialog might need it if it relies on Portal/Radix quirks in JSDOM)
// For now, let's try rendering them naturally. If it fails, we mock.

describe('JobPostCard', () => {
    const mockDispatch = vi.fn();
    const mockRouter = { push: vi.fn() };
    const mockUseAppSelector = vi.fn();

    const defaultProps: JobPostCardProps = {
        id: 'job-123',
        title: 'Software Engineer',
        color: '#FFFFFF',
        status: 'Job Created', // Valid literal from union
        postUrl: 'https://example.com/job',
        columnId: 'col-1',
        deadline: '2023-12-31T23:59:59Z',
        timeStamp: '2023-01-01T10:00:00Z',
        companyName: 'Tech Corp',
        companyUrl: 'tech.com',
        statusChangedTime: '2023-01-02T10:00:00Z',
        notes: [], // Correct empty array
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup hooks
        vi.mocked(reduxHooks.useAppDispatch).mockReturnValue(mockDispatch);
        vi.mocked(reduxHooks.useAppSelector).mockImplementation(mockUseAppSelector);
        vi.mocked(navigation.useRouter).mockReturnValue(mockRouter as any);
        vi.mocked(navigation.useParams).mockReturnValue({ board_id: 'board-1' });

        // Setup Selector Data for deletion logic
        mockUseAppSelector.mockReturnValue({
            boards: [
                {
                    id: 'board-1',
                    columns: [
                        {
                            id: 'col-1',
                            name: 'Applied',
                            jobApplications: [
                                { id: 'job-123', title: 'Software Engineer' } // Partial match for delete logic
                            ]
                        }
                    ]
                }
            ]
        });
    });

    it('renders job title and company name', () => {
        render(<JobPostCard {...defaultProps} />);
        
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        // Company name appears twice: in logo and in span
        const companyNames = screen.getAllByText('Tech Corp');
        expect(companyNames).toHaveLength(2);
        expect(screen.getByTestId('company-logo')).toHaveTextContent('Tech Corp');
    });

    it('shows icons on hover', async () => {
        vi.useFakeTimers();
        render(<JobPostCard {...defaultProps} />);
        
        // Initially icons hidden (or empty div placeholders)
        // The component renders empty divs when showIcons is false.
        // Let's verify standard content first.
        
        const card = screen.getByText('Software Engineer').closest('.rounded-sm');
        expect(card).toBeInTheDocument();

        // Simulate hover
        fireEvent.mouseEnter(card!);
        
        // Icons appear after 200ms
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Now delete icon should be visible/rendered
        // The delete trigger is inside an existing div, we can look for the icon or the trigger ID
        // The code uses: id={id} for the delete trigger div.
        const deleteTrigger = screen.getAllByRole('generic').find(e => e.id === 'job-123'); // id={id} is used on the delete button wrapper
        expect(deleteTrigger).toBeInTheDocument();

        vi.useRealTimers();
    });

    it('navigates to details page on click if authorized', () => {
        render(<JobPostCard {...defaultProps} />);
        
        fireEvent.click(screen.getByText('Software Engineer'));
        
        expect(mockRouter.push).toHaveBeenCalledWith('/home/boards/board-1/job/job-123/job-details');
    });

    it('redirects to login if unauthorized', () => {
        render(<JobPostCard {...defaultProps} />);
        
        fireEvent.click(screen.getByText('Software Engineer'));
        
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('dispatches delete action when confirmed', async () => {
        vi.useFakeTimers();
        render(<JobPostCard {...defaultProps} />);
        
        const card = screen.getByText('Software Engineer').closest('.rounded-sm');
        fireEvent.mouseEnter(card!);
        act(() => {
            vi.advanceTimersByTime(200);
        });
        
        // Find delete button
        // The wrapper has id={id}.
        // Note: The click handler on the wrapper sets isDialogOpen(true).
        const deleteButtonWrapper = document.getElementById('job-123');
        expect(deleteButtonWrapper).toBeInTheDocument();

        await act(async () => {
             fireEvent.click(deleteButtonWrapper!);
        });

        // Dialog should be open. Searching for text "Delete Job Post"
        expect(screen.getByText('Delete Job Post')).toBeInTheDocument();

        // Click Delete action
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        expect(mockDispatch).toHaveBeenCalled();
        // We can verify specific call arguments if needed
        
        vi.useRealTimers();
    });
});
