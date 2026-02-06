/**
 * Test Suite: Board Sync - Deleted Job Resurrection Prevention
 * 
 * This test validates that jobs deleted on other clients are properly
 * removed from local state when getBoardWithColumns is called, rather
 * than being resurrected by merge logic.
 * 
 * Scenario:
 * 1. Client A has a board with jobs [Job1, Job2, Job3]
 * 2. Client B deletes Job2 from the server
 * 3. Client A calls getBoardWithColumns
 * 4. Expected: Client A's state should show [Job1, Job3] (Job2 removed)
 * 5. Bug (before fix): Client A's state would show [Job1, Job2, Job3] (Job2 resurrected)
 */

import boardsReducer from '../boardsSlice';
import { getBoardWithColumns } from '../boardsThunk';

describe('boardsSlice - Deleted Job Sync', () => {
  const mockBoard: Board = {
    id: 'board-1',
    name: 'Test Board',
    userId: 'user-1',
    isArchived: false,
    columns: [
      {
        id: 'column-1',
        name: 'Applied',
        order: 1,
        board_id: 'board-1',
        jobApplications: [
          {
            id: 'job-1',
            title: 'Frontend Developer',
            company: { id: 'company-1', name: 'Company A', url: '', industry: '', description: '' },
            location: 'Remote',
            salary: '$100k',
            postUrl: 'https://example.com/job1',
            description: 'Job 1 description',
            color: '#000000',
            deadline: '',
            status: 'Applied',
            column_id: 'column-1',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            statusChangedAt: '2024-01-01',
            notes: [],
            contacts: [],
            documents: [],
          },
          {
            id: 'job-2',
            title: 'Backend Developer',
            company: { id: 'company-2', name: 'Company B', url: '', industry: '', description: '' },
            location: 'Remote',
            salary: '$110k',
            postUrl: 'https://example.com/job2',
            description: 'Job 2 description',
            color: '#000000',
            deadline: '',
            status: 'Applied',
            column_id: 'column-1',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-02',
            statusChangedAt: '2024-01-02',
            notes: [],
            contacts: [],
            documents: [],
          },
          {
            id: 'job-3',
            title: 'Full Stack Developer',
            company: { id: 'company-3', name: 'Company C', url: '', industry: '', description: '' },
            location: 'Remote',
            salary: '$120k',
            postUrl: 'https://example.com/job3',
            description: 'Job 3 description',
            color: '#000000',
            deadline: '',
            status: 'Applied',
            column_id: 'column-1',
            createdAt: '2024-01-03',
            updatedAt: '2024-01-03',
            statusChangedAt: '2024-01-03',
            notes: [],
            contacts: [],
            documents: [],
          },
        ],
      },
    ],
  };

  it('should remove jobs deleted on other clients (not resurrect them)', () => {
    // Initial state: Client A has all 3 jobs
    const initialState = {
      boards: [mockBoard],
      error: null,
      archivedBoards: [],
      boardsStatus: 'succeeded' as const,
    };

    // Server response: Job2 was deleted on Client B
    const serverResponse: Board = {
      ...mockBoard,
      columns: [
        {
          ...mockBoard.columns[0],
          jobApplications: [
            mockBoard.columns[0].jobApplications[0], // Job1
            mockBoard.columns[0].jobApplications[2], // Job3
            // Job2 is missing (deleted on Client B)
          ],
        },
      ],
    };

    // Simulate getBoardWithColumns.fulfilled action
    const action = {
      type: getBoardWithColumns.fulfilled.type,
      payload: serverResponse,
    };

    const newState = boardsReducer(initialState, action);

    // Verify Job2 is removed (not resurrected)
    const updatedBoard = newState.boards.find((b) => b.id === 'board-1');
    const jobIds = updatedBoard?.columns?.[0]?.jobApplications?.map((j) => j.id) || [];

    expect(jobIds).toEqual(['job-1', 'job-3']);
    expect(jobIds).not.toContain('job-2');
    expect(updatedBoard?.columns?.[0]?.jobApplications?.length).toBe(2);
  });

  it('should handle complete column job deletion', () => {
    const initialState = {
      boards: [mockBoard],
      error: null,
      archivedBoards: [],
      boardsStatus: 'succeeded' as const,
    };

    // Server response: All jobs deleted
    const serverResponse: Board = {
      ...mockBoard,
      columns: [
        {
          ...mockBoard.columns[0],
          jobApplications: [],
        },
      ],
    };

    const action = {
      type: getBoardWithColumns.fulfilled.type,
      payload: serverResponse,
    };

    const newState = boardsReducer(initialState, action);

    const updatedBoard = newState.boards.find((b) => b.id === 'board-1');
    expect(updatedBoard?.columns?.[0]?.jobApplications?.length).toBe(0);
  });

  it('should handle new jobs added on other clients', () => {
    const initialState = {
      boards: [mockBoard],
      error: null,
      archivedBoards: [],
      boardsStatus: 'succeeded' as const,
    };

    const newJob = {
      id: 'job-4',
      title: 'DevOps Engineer',
      company: { id: 'company-4', name: 'Company D', url: '', industry: '', description: '' },
      location: 'Remote',
      salary: '$130k',
      postUrl: 'https://example.com/job4',
      description: 'Job 4 description',
      color: '#000000',
      deadline: '',
      status: 'Applied' as const,
      column_id: 'column-1',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04',
      statusChangedAt: '2024-01-04',
      notes: [],
      contacts: [],
      documents: [],
    };

    // Server response: Job4 added on Client B
    const serverResponse: Board = {
      ...mockBoard,
      columns: [
        {
          ...mockBoard.columns[0],
          jobApplications: [
            ...mockBoard.columns[0].jobApplications,
            newJob,
          ],
        },
      ],
    };

    const action = {
      type: getBoardWithColumns.fulfilled.type,
      payload: serverResponse,
    };

    const newState = boardsReducer(initialState, action);

    const updatedBoard = newState.boards.find((b) => b.id === 'board-1');
    const jobIds = updatedBoard?.columns?.[0]?.jobApplications?.map((j) => j.id) || [];

    expect(jobIds).toContain('job-4');
    expect(updatedBoard?.columns?.[0]?.jobApplications?.length).toBe(4);
  });

  it('should replace entire board state with server response', () => {
    const initialState = {
      boards: [mockBoard],
      error: null,
      archivedBoards: [],
      boardsStatus: 'succeeded' as const,
    };

    // Server response with completely different data
    const serverResponse: Board = {
      id: 'board-1',
      name: 'Updated Board Name',
      userId: 'user-1',
      isArchived: false,
      columns: [
        {
          id: 'column-2',
          name: 'Interview',
          order: 2,
          board_id: 'board-1',
          jobApplications: [],
        },
      ],
    };

    const action = {
      type: getBoardWithColumns.fulfilled.type,
      payload: serverResponse,
    };

    const newState = boardsReducer(initialState, action);

    const updatedBoard = newState.boards.find((b) => b.id === 'board-1');
    
    // Verify complete replacement
    expect(updatedBoard?.name).toBe('Updated Board Name');
    expect(updatedBoard?.columns?.length).toBe(1);
    expect(updatedBoard?.columns?.[0]?.id).toBe('column-2');
    expect(updatedBoard?.columns?.[0]?.name).toBe('Interview');
  });
});
