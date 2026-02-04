/**
 * Extension Message Listener
 *
 * Handles incoming messages from the browser extension for direct communication
 * without relying on URL parameters. This enables tab reuse and better UX.
 *
 * Message Format:
 * {
 *   type: 'JOB_DATA',
 *   source: 'job-tracker-extension',
 *   payload: {
 *     company: string;
 *     title: string;
 *     location?: string;
 *     salary?: string;
 *     url?: string;
 *     source?: 'linkedin' | 'indeed' | 'manual';
 *   }
 * }
 */

export interface ExtensionMessage {
  type: 'JOB_DATA';
  source: 'job-tracker-extension';
  data: {
    company: string;
    companyDomain?: string;
    companyLogo?: string | null;
    title: string;
    location?: string;
    salary?: string;
    url?: string;
    storageKey?: string;
  };
}

export type ExtensionMessageHandler = (data: ExtensionMessage['data']) => void;

/**
 * Initialize extension message listener
 * @param handler - Callback function to handle received job data
 * @returns Cleanup function to remove the listener
 */
export function initExtensionMessageListener(
  handler: ExtensionMessageHandler,
): () => void {
  const messageListener = (event: MessageEvent) => {
    // Verify message origin (allow from same origin or extension)
    // In production, you might want to be more restrictive
    if (!event.data || typeof event.data !== 'object') {
      return;
    }

    const message = event.data as Partial<ExtensionMessage>;

    // Validate message structure
    if (
      message.type === 'JOB_DATA' &&
      message.source === 'job-tracker-extension' &&
      message.data &&
      typeof message.data === 'object'
    ) {
      // Validate required fields
      if (
        typeof message.data.company === 'string' &&
        typeof message.data.title === 'string' &&
        message.data.company.trim() &&
        message.data.title.trim()
      ) {
        console.log('Extension message received:', message.data);

        // Send acknowledgment
        sendAcknowledgment();

        handler(message.data);
      } else {
        console.warn('Invalid message data: missing required fields');
      }
    }
  };

  // Add listener
  window.addEventListener('message', messageListener);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageListener);
  };
}

/**
 * Send acknowledgment back to extension
 * This can be used to confirm the frontend received the data
 */
export function sendAcknowledgment(): void {
  window.postMessage(
    {
      type: 'JOB_DATA_RECEIVED',
      source: 'job-tracker-frontend',
    },
    window.location.origin,
  );
}
