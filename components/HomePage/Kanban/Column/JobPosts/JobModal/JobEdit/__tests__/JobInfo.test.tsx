import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobInfo from '../JobInfo';
import * as reduxHooks from '@/redux/hooks';
import * as navigation from 'next/navigation';
import * as jobsThunk from '@/redux/jobs/jobsThunk';

// Mock dependencies
vi.mock('@/redux/hooks');
vi.mock('next/navigation');
vi.mock('@/redux/jobs/jobsThunk');

// Mock child components
vi.mock('../InputElement', () => ({
    default: ({ id, labelName, value, sendData }: any) => (
        <div data-testid={`input-${id}`}>
            <label>{labelName}</label>
            <input
                value={value || ''}
                onChange={(e) => sendData?.(id, e.target.value)}
                data-testid={`input-field-${id}`}
            />
        </div>
    ),
}));

vi.mock('../TextEditor', () => ({
    default: ({ id, title, value, sendData }: any) => (
        <div data-testid={`editor-${id}`}>
            <label>{title}</label>
            <textarea
                value={value || ''}
                onChange={(e) => sendData?.(id, e.target.value)}
                data-testid={`editor-field-${id}`}
            />
        </div>
    ),
}));

vi.mock('../ColorPicker', () => ({
    default: ({ id, sendData }: any) => (
        <div data-testid={`colorpicker-${id}`}>
            <button onClick={() => sendData?.(id, '#FF5733')}>Pick Color</button>
        </div>
    ),
}));

vi.mock('@/components/Misc/Loader', () => ({
    default: ({ title }: any) => <div data-testid="loader">{title}</div>,
}));

// Mock Calendar component
vi.mock('@/components/ui/calendar', () => ({
    Calendar: ({ onSelect }: any) => (
        <div data-testid="calendar">
            <button onClick={() => onSelect(new Date('2024-12-31'))}>
                Select Date
            </button>
        </div>
    ),
}));

describe('JobInfo', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = vi.fn();

    const mockJobPost = {
        id: 'job-123',
        title: 'Senior Developer',
        salary: '$120,000',
        location: 'Remote',
        postUrl: 'https://example.com/job',
        description: 'Great opportunity',
        deadline: '2024-12-31',
        color: '#FFFFFF',
        company: {
            name: 'Tech Corp',
            url: 'tech.com',
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock localStorage
        Storage.prototype.getItem = vi.fn((key) => {
            if (key === 'accessToken') return 'test-token';
            if (key === 'columnId') return 'col-1';
            return null;
        });

        // Setup Redux hooks
        vi.mocked(reduxHooks.useAppDispatch).mockReturnValue(mockDispatch);
        vi.mocked(reduxHooks.useAppSelector).mockImplementation((selector: any) => {
            return selector({
                jobs: {
                    jobPosts: [mockJobPost],
                    jobPostsStatus: 'succeeded',
                },
            });
        });

        // Setup navigation
        vi.mocked(navigation.useParams).mockReturnValue({ job_id: 'job-123' });

        // Mock thunks to return themselves (for dispatch tracking)
        vi.mocked(jobsThunk.getAllJobPostsPerColumn).mockImplementation((payload: any) => payload as any);
        vi.mocked(jobsThunk.updateJobPost).mockImplementation((payload: any) => payload as any);
    });

    it('fetches job data on mount', () => {
        render(<JobInfo />);

        expect(mockDispatch).toHaveBeenCalledWith({
            accessToken: 'test-token',
            columnId: 'col-1',
        });
    });

    it('displays loading state initially', () => {
        // Mock loading state
        vi.mocked(reduxHooks.useAppSelector).mockImplementation((selector: any) => {
            return selector({
                jobs: {
                    jobPosts: [],
                    jobPostsStatus: 'loading',
                },
            });
        });

        render(<JobInfo />);

        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(screen.getByText('Loading job post')).toBeInTheDocument();
    });

    it('renders form fields with correct initial values', async () => {
        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('input-title')).toBeInTheDocument();
        });

        const titleInput = screen.getByTestId('input-field-title') as HTMLInputElement;
        const salaryInput = screen.getByTestId('input-field-salary') as HTMLInputElement;
        const locationInput = screen.getByTestId('input-field-location') as HTMLInputElement;

        expect(titleInput.value).toBe('Senior Developer');
        expect(salaryInput.value).toBe('$120,000');
        expect(locationInput.value).toBe('Remote');
    });

    it('dispatches updateJobPost when salary is changed', async () => {
        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('input-field-salary')).toBeInTheDocument();
        });

        const salaryInput = screen.getByTestId('input-field-salary');
        fireEvent.change(salaryInput, { target: { value: '$150,000' } });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                accessToken: 'test-token',
                company: { name: 'Tech Corp' },
                jobPostId: 'job-123',
                salary: '$150,000',
            });
        });
    });

    it('dispatches updateJobPost when location is changed', async () => {
        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('input-field-location')).toBeInTheDocument();
        });

        const locationInput = screen.getByTestId('input-field-location');
        fireEvent.change(locationInput, { target: { value: 'New York' } });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                accessToken: 'test-token',
                company: { name: 'Tech Corp' },
                jobPostId: 'job-123',
                location: 'New York',
            });
        });
    });

    it('dispatches updateJobPost when description is changed', async () => {
        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('editor-field-description')).toBeInTheDocument();
        });

        const descriptionEditor = screen.getByTestId('editor-field-description');
        fireEvent.change(descriptionEditor, { target: { value: 'Updated description' } });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                accessToken: 'test-token',
                company: { name: 'Tech Corp' },
                jobPostId: 'job-123',
                description: 'Updated description',
            });
        });
    });

    it('validates URL before dispatching update', async () => {
        // Mock window.alert
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('input-field-postUrl')).toBeInTheDocument();
        });

        const urlInput = screen.getByTestId('input-field-postUrl');
        
        // Test invalid URL
        fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(
                'Invalid URL format. Example: https://www.example.com'
            );
        });

        // Should not dispatch for invalid URL
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                postUrl: 'invalid-url',
            })
        );

        alertMock.mockRestore();
    });

    it('does not dispatch update if value is unchanged', async () => {
        render(<JobInfo />);

        await waitFor(() => {
            expect(screen.getByTestId('input-field-salary')).toBeInTheDocument();
        });

        // Clear previous dispatch calls
        mockDispatch.mockClear();

        const salaryInput = screen.getByTestId('input-field-salary');
        
        // Change to the same value
        fireEvent.change(salaryInput, { target: { value: '$120,000' } });

        // Wait a bit to ensure no dispatch happens
        await new Promise(resolve => setTimeout(resolve, 100));

        // Should not dispatch since value is the same
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
