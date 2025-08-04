import client from '@/api/client';

// Define DocumentJobApplication interface locally to avoid import issues
interface DocumentJobApplication {
  id: string;
  title: string;
  // Add other properties as needed
}

/**
 * Service for handling document-related operations and business logic
 */
export class DocumentService {
  /**
   * Get all job applications associated with a document
   */
  static async getDocumentJobApplications(
    documentId: string
  ): Promise<DocumentJobApplication[]> {
    try {
      const response = await client.get(`/documents/${documentId}`);
      return response.data.jobApplications || [];
    } catch (error) {
      throw new Error(`Failed to fetch document ${documentId}: ${error}`);
    }
  }

  /**
   * Check if a document is shared across multiple job applications
   * (excluding the specified job application)
   */
  static async isDocumentShared(
    documentId: string,
    excludeJobId: string
  ): Promise<boolean> {
    const jobApplications = await this.getDocumentJobApplications(documentId);

    const otherJobApplications = jobApplications.filter(
      (jobApp: any) => jobApp.id !== excludeJobId
    );

    return otherJobApplications.length > 0;
  }

  /**
   * Detach a document from a specific job application
   */
  static async detachDocumentFromJob(
    documentId: string,
    jobId: string
  ): Promise<void> {
    await client.post(
      `/documents/${documentId}/job-application/${jobId}/detach`
    );
  }

  /**
   * Delete a document completely
   */
  static async deleteDocument(documentId: string): Promise<void> {
    await client.delete(`/documents/${documentId}`);
  }

  /**
   * Poll for document detachment completion
   */
  static async pollForDetachment(
    documentId: string,
    jobId: string,
    maxWait = 5000,
    pollInterval = 250
  ): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < maxWait) {
      try {
        const jobApplications = await this.getDocumentJobApplications(
          documentId
        );

        const stillAttached = jobApplications.some(
          (jobApp: any) => jobApp.id === jobId
        );

        if (!stillAttached) {
          return; // Detachment complete
        }
      } catch (error: any) {
        // Only treat 404 errors as completion, re-throw others
        if (error.response?.status === 404) {
          return; // Document doesn't exist, detachment is complete
        }
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Document detachment timeout after ${maxWait}ms`);
  }

  /**
   * Handle document cleanup for job deletion
   * Returns the processing result for each document
   */
  static async handleDocumentsForJobDeletion(
    documents: any[],
    jobId: string
  ): Promise<
    { documentId: string; action: 'detached' | 'deleted'; error?: string }[]
  > {
    const CONCURRENCY_LIMIT = 5;
    const results: {
      documentId: string;
      action: 'detached' | 'deleted';
      error?: string;
    }[] = [];

    // Process documents in batches to avoid overwhelming the API
    for (let i = 0; i < documents.length; i += CONCURRENCY_LIMIT) {
      const batch = documents.slice(i, i + CONCURRENCY_LIMIT);
      const batchPromises = batch.map(async (document: any) => {
        try {
          const isShared = await this.isDocumentShared(document.id, jobId);

          if (isShared) {
            // Document is shared - only detach from current job
            await this.detachDocumentFromJob(document.id, jobId);
            return { documentId: document.id, action: 'detached' as const };
          } else {
            // Document is orphaned - detach and delete
            await this.detachDocumentFromJob(document.id, jobId);

            // Wait for detachment to complete
            await this.pollForDetachment(document.id, jobId);

            // Then delete the document
            await this.deleteDocument(document.id);
            return { documentId: document.id, action: 'deleted' as const };
          }
        } catch (error) {
          return {
            documentId: document.id,
            action: 'detached' as const,
            error: `Failed to process document: ${error}`,
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }
}
