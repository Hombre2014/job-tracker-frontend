/**
 * Extension Bridge Utilities
 * Handles communication with the Job Tracker Chrome Extension
 */

// Declare Chrome types for TypeScript
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage?: (extensionId: string, message: any) => Promise<any>;
      };
    };
  }
}

export interface ExtensionJobData {
  company: string;
  companyDomain: string;
  companyLogo: string | null;
  title: string;
  location: string;
  description: string; // Full description, no truncation
  url: string;
  salary: string;
  columnId: string;
  autoSave: boolean;
  timestamp: number;
}

/**
 * Retrieve full job data from extension storage
 * @param storageKey - The storage key passed via URL parameter
 * @param extensionId - The Chrome extension ID (optional, will try to detect)
 * @returns Full job data or null if retrieval fails
 */
export const retrieveJobDraftFromExtension = async (
  storageKey: string,
  extensionId?: string,
): Promise<ExtensionJobData | null> => {
  try {
    // Check if we're in a browser environment with Chrome API
    if (
      typeof globalThis.window === 'undefined' ||
      !globalThis.window.chrome?.runtime?.sendMessage
    ) {
      console.warn('Extension bridge: Chrome runtime not available');
      return null;
    }

    // Try to get extension ID from environment if not provided
    const targetExtensionId =
      extensionId || process.env.NEXT_PUBLIC_EXTENSION_ID;

    if (!targetExtensionId) {
      console.warn(
        'Extension bridge: No extension ID provided. Set NEXT_PUBLIC_EXTENSION_ID in your .env.local',
      );
      return null;
    }

    // Request data from extension
    const response = await globalThis.window.chrome.runtime.sendMessage(
      targetExtensionId,
      {
        action: 'getJobDraft',
        key: storageKey,
      },
    );

    if (response?.success && response.data) {
      return response.data as ExtensionJobData;
    } else {
      console.warn('Extension bridge: Failed to retrieve data:', response);
      return null;
    }
  } catch (error) {
    console.error(
      'Extension bridge: Error communicating with extension:',
      error,
    );
    return null;
  }
};

/**
 * Check if extension is available and can be communicated with
 */
export const isExtensionAvailable = (): boolean => {
  return (
    typeof globalThis.window !== 'undefined' &&
    !!globalThis.window.chrome?.runtime?.sendMessage
  );
};
