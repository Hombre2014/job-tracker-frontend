import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import CreateMenu from '../CreateMenu';
import * as hooks from '@/redux/hooks';
import * as navigation from 'next/navigation';
import * as jobsThunk from '@/redux/jobs/jobsThunk';

// Mocks
vi.mock('@/redux/hooks');
vi.mock('next/navigation');
vi.mock('@/redux/jobs/jobsThunk');
vi.mock('@/redux/companies/companiesThunk');
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Mock Radix Navigation Menu
vi.mock('@/components/ui/navigation-menu', () => ({
  NavigationMenu: ({ children }: any) => <div>{children}</div>,
  NavigationMenuList: ({ children }: any) => <ul>{children}</ul>,
  NavigationMenuItem: ({ children }: any) => <li>{children}</li>,
  NavigationMenuTrigger: ({ children }: any) => <button>{children}</button>,
  NavigationMenuContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock child components
vi.mock('@/components/Forms/AddJobShort/AddJobShortForm', () => ({
  default: ({ onDraftChange }: any) => (
    <div data-testid="add-job-form">
      <input
        placeholder="Job Title"
        data-testid="job-title-input"
        onChange={(e) => onDraftChange({ jobTitle: e.target.value })}
      />
      <input
        placeholder="Company Name"
        data-testid="company-input"
        onChange={(e) => onDraftChange({ company: e.target.value })}
      />
    </div>
  ),
}));

vi.mock('@/components/Forms/AddContact/CreateContactForm', () => ({
  default: () => <div data-testid="add-contact-form">Contact Form</div>,
}));

vi.mock('@/components/HomePage/Boards/AlertDialogModal', async () => {
  const { forwardRef } = await import('react');
  return {
    default: ({ open, children, buttonConfirm, actionFunction }: any) => {
      if (!open) return null;
      return (
        <div data-testid="alert-dialog">
          {children}
          <button onClick={actionFunction}>{buttonConfirm}</button>
        </div>
      );
    },
  };
});

describe('CreateMenu', () => {
  const mockDispatch = vi.fn();
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useAppDispatch as any).mockReturnValue(mockDispatch);
    (navigation.useRouter as any).mockReturnValue(mockRouter);
    (navigation.usePathname as any).mockReturnValue('/home/boards/board-1');
    (navigation.useParams as any).mockReturnValue({ board_id: 'board-1' });

    // Mock thunk returns
    (jobsThunk.createJobPost as any).mockReturnValue({
      type: 'jobs/createJobPost/fulfilled',
      payload: { id: 'new-job-id' },
    });

    // Thunks usually return a promise that resolves to an action object,
    // and when dispatched, that promise resolves.
    // To mock dispatch(createJobPost(...)).then(...) we need dispatch to return a promise.
    mockDispatch.mockImplementation((action: any) => {
      // Simulate thunk behavior: if action is a function (thunk), call it.
      // But here we are dispatching result of createJobPost(), which we mocked to return an object.
      // Actually, RTK dispatch returns the action object (or promise for thunks).
      // In the component: dispatch(createJobPost(jobPost)).then(...)
      // So dispatch must return a Promise that resolves to the result action.
      return Promise.resolve({
        payload: { id: 'new-job-id' },
        type: 'jobs/createJobPost/fulfilled',
        meta: { requestStatus: 'fulfilled' },
      });
    });
  });

  it('opens job modal when functionality is triggered', () => {
    render(<CreateMenu />);

    // Open menu
    const createBtn = screen.getByText('+ Create');
    fireEvent.click(createBtn);

    // Click Job item
    const jobItem = screen.getByText('Job');
    fireEvent.click(jobItem);

    expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('add-job-form')).toBeInTheDocument();
  });

  it('creates a job post when save is clicked', async () => {
    // 1. Setup mock to start with 'pending' then 'fulfilled' if needed, or simply return action
    // But our simplified mockDispatch handles promises.

    render(<CreateMenu />);

    // Open modal
    fireEvent.click(screen.getByText('+ Create'));
    fireEvent.click(screen.getByText('Job'));

    // Fill form
    const titleInput = screen.getByTestId('job-title-input');
    fireEvent.change(titleInput, { target: { value: 'Frontend Dev' } });

    // Check if button is clickable
    const saveBtn = screen.getByText('Save Job');
    expect(saveBtn).toBeInTheDocument();

    // Click Save
    fireEvent.click(saveBtn);

    // Wait for dispatch
    await waitFor(() => {
      expect(jobsThunk.createJobPost).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Frontend Dev',
        }),
      );
    });

    // Wait for router push
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining('new-job-id'),
      );
    });
  });
});
