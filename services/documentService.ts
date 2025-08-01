import client from '@/api/client';

/**
 * Service for handling document-related operations and business logic
 */
export class DocumentService {
  /**
   * Get all job applications associated with a document
   */
  static async getDocumentJobApplications(
    documentId: string,
    accessToken: string
  ): Promise<any[]> {
    try {
      const response = await client.get(`/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.jobApplications || [];
    } catch (error) {
      console.error(`Failed to fetch document ${documentId}:`, error);
      return [];
    }
  }

  /**
   * Check if a document is shared across multiple job applications
   * (excluding the specified job application)
   */
  static async isDocumentShared(
    documentId: string,
    excludeJobId: string,
    accessToken: string
  ): Promise<boolean> {
    const jobApplications = await this.getDocumentJobApplications(
      documentId,
      accessToken
    );

    const otherJobApplications = jobApplications.filter(
      (jobApp: any) => jobApp.id !== excludeJobId
    );

    return otherJobApplications.length > 0;
  }

  /**
   * Detach a document from a job application
   */
  static async detachDocumentFromJob(
    documentId: string,
    jobId: string,
    accessToken: string
  ): Promise<void> {
    await client.post(
      `/documents/${documentId}/job-application/${jobId}/detach`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  /**
   * Delete a document completely
   */
  static async deleteDocument(
    documentId: string,
    accessToken: string
  ): Promise<void> {
    await client.delete(`/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Wait for a document detachment to be processed
   */
  static async waitForDetachmentComplete(
    documentId: string,
    jobId: string,
    accessToken: string,
    maxWait = 5000
  ): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < maxWait) {
      try {
        const jobApplications = await this.getDocumentJobApplications(
          documentId,
          accessToken
        );

        const stillAttached = jobApplications.some(
          (jobApp: any) => jobApp.id === jobId
        );

        if (!stillAttached) {
          return; // Detachment complete
        }
      } catch {
        return; // If document doesn't exist, detachment is complete
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error(`Document detachment timeout after ${maxWait}ms`);
  }

  /**
   * Handle document cleanup for job deletion
   * Returns the processing result for each document
   */
  static async handleDocumentsForJobDeletion(
    documents: any[],
    jobId: string,
    accessToken: string
  ): Promise<{ documentId: string; action: 'detached' | 'deleted' }[]> {
    const documentProcessingPromises = documents.map(async (document: any) => {
      const isShared = await this.isDocumentShared(
        document.id,
        jobId,
        accessToken
      );

      if (isShared) {
        // Document is shared - only detach from current job
        await this.detachDocumentFromJob(document.id, jobId, accessToken);
        return { documentId: document.id, action: 'detached' as const };
      } else {
        // Document is orphaned - detach and delete
        await this.detachDocumentFromJob(document.id, jobId, accessToken);

        // Wait for detachment to complete
        await this.waitForDetachmentComplete(document.id, jobId, accessToken);

        // Then delete the document
        await this.deleteDocument(document.id, accessToken);
        return { documentId: document.id, action: 'deleted' as const };
      }
    });

    return Promise.all(documentProcessingPromises);
  }
}
