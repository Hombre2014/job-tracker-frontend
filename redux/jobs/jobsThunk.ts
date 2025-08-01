import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultJobPostColor } from '@/data/constants';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, title, companyId, columnId, status } = values;
    const body = {
      title: title,
      status: status,
      columnId: columnId,
      companyId: companyId,
      color: defaultJobPostColor,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await client.post('/job-applications', body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating job post'
      );
    }
  }
);

export const getAllJobPostsPerColumn = createAsyncThunk(
  'jobs/getAllJobPostsPerColumn',
  async (values: any, thunkAPI) => {
    const { accessToken, columnId } = values;
    try {
      const res = await client.get(`/job-applications/column/${columnId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching job posts'
      );
    }
  }
);

export const updateJobPost = createAsyncThunk(
  'jobs/updateJobPost',
  async (values: any, thunkAPI) => {
    const {
      title,
      color,
      salary,
      status,
      postUrl,
      location,
      deadline,
      columnId,
      jobPostId,
      accessToken,
      description,
      statusChangedAt,
      company: { name: companyName },
    } = values;
    const body = {
      title: title,
      color: color,
      salary: salary,
      status: status,
      postUrl: postUrl,
      location: location,
      deadline: deadline,
      columnId: columnId,
      description: description,
      statusChangedAt: statusChangedAt,
      company: {
        name: companyName,
      },
    };
    try {
      const res = await client.put(`/job-applications/${jobPostId}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating job post'
      );
    }
  }
);

export const deleteJobPost = createAsyncThunk(
  'jobs/deleteJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, jobPostId, jobPostData } = values;
    try {
      // Step 1: Handle documents attached to this job post
      if (jobPostData?.documents && jobPostData.documents.length > 0) {
        for (const document of jobPostData.documents) {
          // Fetch complete document data with jobApplications relationships
          const documentResponse = await client.get(
            `/documents/${document.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const fullDocumentData = documentResponse.data;

          // Check if document is attached to other job applications (excluding current job)
          const otherJobApplications =
            fullDocumentData.jobApplications?.filter(
              (jobApp: any) => jobApp.id !== jobPostId
            ) || [];

          const hasOtherJobApplications = otherJobApplications.length > 0;

          if (hasOtherJobApplications) {
            // Document is attached to other jobs - just detach from this job
            await client.post(
              `/documents/${document.id}/job-application/${jobPostId}/detach`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
          } else {
            // Document is only attached to this job - detach and delete
            // First detach
            await client.post(
              `/documents/${document.id}/job-application/${jobPostId}/detach`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            // Small delay to ensure detachment is processed
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Then delete the document
            await client.delete(`/documents/${document.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          }
        }

        // Small delay to ensure all document operations are completed
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Step 2: Delete the job post itself
      try {
        await client.delete(`/job-applications/${jobPostId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return jobPostId;
      } catch (deleteError: any) {
        // Log the error but check if job was actually deleted
        console.warn(
          'Job deletion returned error, but job might still be deleted:',
          deleteError.response?.data
        );

        // Wait a moment and try to verify if job still exists
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          // Try to fetch the job to see if it still exists
          await client.get(`/job-applications/${jobPostId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // If we get here, job still exists, so deletion really failed
          return thunkAPI.rejectWithValue(
            deleteError.response?.data || 'Error deleting job post'
          );
        } catch (verifyError: any) {
          // If we get 404, job was actually deleted successfully despite the error
          if (verifyError.response?.status === 404) {
            console.log(
              'Job was actually deleted successfully despite the error'
            );
            return jobPostId; // Success!
          }
          // Other error, re-throw original deletion error
          return thunkAPI.rejectWithValue(
            deleteError.response?.data || 'Error deleting job post'
          );
        }
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting job post'
      );
    }
  }
);

export const getJobPost = createAsyncThunk(
  'jobs/getJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, jobPostId } = values;
    try {
      const res = await client.get(`/job-applications/${jobPostId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching job post'
      );
    }
  }
);
