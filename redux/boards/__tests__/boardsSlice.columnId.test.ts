import boardsReducer from '../boardsSlice';
import { createJobPost, updateJobPost } from '../../jobs/jobsThunk';

describe('boardsSlice - column_id vs columnId handling', () => {
  const initialState = {
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        userId: 'user-1',
        isArchived: false,
        columns: [
          {
            id: 'column-1',
            name: 'Wishlist',
            order: 0,
            board_id: 'board-1',
            jobApplications: [],
          },
          {
            id: 'column-2',
            name: 'Applied',
            order: 1,
            board_id: 'board-1',
            jobApplications: [],
          },
        ],
      },
    ],
    archivedBoards: [],
    boardsStatus: 'idle' as const,
    error: null,
  };

  describe('createJobPost.fulfilled', () => {
    it('should add job when API returns column_id (snake_case)', () => {
      const newJob = {
        id: 'job-1',
        title: 'Software Engineer',
        column_id: 'column-1', // API returns snake_case
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: createJobPost.fulfilled.type,
        payload: newJob,
      };

      const newState = boardsReducer(initialState, action);

      // Job should be added to column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[0].jobApplications[0].id).toBe('job-1');
    });

    it('should add job when API returns columnId (camelCase) - backward compatibility', () => {
      const newJob = {
        id: 'job-2',
        title: 'Product Manager',
        columnId: 'column-2', // Hypothetical future camelCase
        column_id: 'column-2',
        company: { id: 'comp-2', name: 'Another Company', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: createJobPost.fulfilled.type,
        payload: newJob,
      };

      const newState = boardsReducer(initialState, action);

      // Job should be added to column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[1].jobApplications[0].id).toBe('job-2');
    });

    it('should add job when API returns ONLY columnId (camelCase) without column_id', () => {
      const newJob = {
        id: 'job-2b',
        title: 'Product Manager',
        columnId: 'column-2', // Only camelCase, no column_id
        company: { id: 'comp-2', name: 'Another Company', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: createJobPost.fulfilled.type,
        payload: newJob,
      };

      const newState = boardsReducer(initialState, action);

      // Job should be added to column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[1].jobApplications[0].id).toBe('job-2b');
    });

    it('should NOT add job when neither column_id nor columnId exists', () => {
      const newJob = {
        id: 'job-3',
        title: 'Designer',
        // No column_id or columnId
        company: { id: 'comp-3', name: 'Design Co', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: createJobPost.fulfilled.type,
        payload: newJob,
      };

      const newState = boardsReducer(initialState, action);

      // No job should be added to any column
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(0);
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(0);
    });
  });

  describe('updateJobPost.fulfilled', () => {
    const stateWithJob = {
      ...initialState,
      boards: [
        {
          ...initialState.boards[0],
          columns: [
            {
              ...initialState.boards[0].columns[0],
              jobApplications: [
                {
                  id: 'job-1',
                  title: 'Software Engineer',
                  column_id: 'column-1',
                  company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
                  status: 'Job Created' as const,
                  color: '#6a776b',
                  salary: '',
                  postUrl: '',
                  location: '',
                  deadline: '',
                  description: '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  statusChangedAt: new Date().toISOString(),
                  notes: [],
                  contacts: [],
                  documents: [],
                },
              ],
            },
            {
              ...initialState.boards[0].columns[1],
              jobApplications: [],
            },
          ],
        },
      ],
    };

    it('should move job when API returns column_id (snake_case)', () => {
      const updatedJob = {
        id: 'job-1',
        title: 'Software Engineer',
        column_id: 'column-2', // Moving to column-2
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Applied' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: updateJobPost.fulfilled.type,
        payload: updatedJob,
      };

      const newState = boardsReducer(stateWithJob, action);

      // Job should be removed from column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(0);
      // Job should be added to column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[1].jobApplications[0].id).toBe('job-1');
    });

    it('should move job when API returns columnId (camelCase) - backward compatibility', () => {
      const updatedJob = {
        id: 'job-1',
        title: 'Software Engineer',
        columnId: 'column-2', // Hypothetical future camelCase
        column_id: 'column-2',
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Applied' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: updateJobPost.fulfilled.type,
        payload: updatedJob,
      };

      const newState = boardsReducer(stateWithJob, action);

      // Job should be removed from column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(0);
      // Job should be added to column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[1].jobApplications[0].id).toBe('job-1');
    });

    it('should move job when API returns ONLY columnId (camelCase) without column_id', () => {
      const updatedJob = {
        id: 'job-1',
        title: 'Software Engineer',
        columnId: 'column-2', // Only camelCase, no column_id
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Applied' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: updateJobPost.fulfilled.type,
        payload: updatedJob,
      };

      const newState = boardsReducer(stateWithJob, action);

      // Job should be removed from column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(0);
      // Job should be added to column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[1].jobApplications[0].id).toBe('job-1');
    });

    it('should keep job in place when updated without column change', () => {
      const updatedJob = {
        id: 'job-1',
        title: 'Senior Software Engineer', // Title changed
        column_id: 'column-1', // Same column
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#ff0000', // Color changed
        salary: '$120k',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: updateJobPost.fulfilled.type,
        payload: updatedJob,
      };

      const newState = boardsReducer(stateWithJob, action);

      // Job should still be in column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(1);
      expect(newState.boards[0].columns[0].jobApplications[0].title).toBe('Senior Software Engineer');
      expect(newState.boards[0].columns[0].jobApplications[0].color).toBe('#ff0000');
    });
  });

  describe('Edge cases', () => {
    it('should not duplicate jobs when createJobPost is called twice', () => {
      const newJob = {
        id: 'job-1',
        title: 'Software Engineer',
        column_id: 'column-1',
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Job Created' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: createJobPost.fulfilled.type,
        payload: newJob,
      };

      let newState = boardsReducer(initialState, action);
      newState = boardsReducer(newState, action); // Call twice

      // Should only have one job
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(1);
    });

    it('should not duplicate jobs when updateJobPost is called twice with same target', () => {
      const stateWithJob = {
        ...initialState,
        boards: [
          {
            ...initialState.boards[0],
            columns: [
              {
                ...initialState.boards[0].columns[0],
                jobApplications: [
                  {
                    id: 'job-1',
                    title: 'Software Engineer',
                    column_id: 'column-1',
                    company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
                    status: 'Job Created' as const,
                    color: '#6a776b',
                    salary: '',
                    postUrl: '',
                    location: '',
                    deadline: '',
                    description: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    statusChangedAt: new Date().toISOString(),
                    notes: [],
                    contacts: [],
                    documents: [],
                  },
                ],
              },
              {
                ...initialState.boards[0].columns[1],
                jobApplications: [],
              },
            ],
          },
        ],
      };

      const updatedJob = {
        id: 'job-1',
        title: 'Software Engineer',
        column_id: 'column-2',
        company: { id: 'comp-1', name: 'Test Company', url: '', industry: '', description: '' },
        status: 'Applied' as const,
        color: '#6a776b',
        salary: '',
        postUrl: '',
        location: '',
        deadline: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
        notes: [],
        contacts: [],
        documents: [],
      };

      const action = {
        type: updateJobPost.fulfilled.type,
        payload: updatedJob,
      };

      let newState = boardsReducer(stateWithJob, action);
      newState = boardsReducer(newState, action); // Call twice

      // Should only have one job in column-2
      expect(newState.boards[0].columns[1].jobApplications).toHaveLength(1);
      // Should have zero jobs in column-1
      expect(newState.boards[0].columns[0].jobApplications).toHaveLength(0);
    });
  });
});
