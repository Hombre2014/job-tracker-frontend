/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initExtensionMessageListener,
  sendAcknowledgment,
} from '../extensionMessageListener';

describe('extensionMessageListener', () => {
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  });

  describe('initExtensionMessageListener', () => {
    it('should call handler with valid message data', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      // Simulate extension message
      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: 'Tesla',
          title: 'Senior Frontend Engineer',
          location: 'Remote',
          salary: '$120k-$160k',
          url: 'https://tesla.com/careers/123',
          source: 'linkedin' as const,
        },
      };

      window.postMessage(message, '*');

      // Wait for message to be processed
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalledWith(message.payload);
    });

    it('should call handler with only required fields', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: 'Google',
          title: 'Software Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).toHaveBeenCalledWith(message.payload);
    });

    it('should not call handler with invalid message type', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'INVALID_TYPE',
        source: 'job-tracker-extension',
        payload: {
          company: 'Tesla',
          title: 'Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler with invalid source', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'malicious-extension',
        payload: {
          company: 'Tesla',
          title: 'Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler when company is missing', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          title: 'Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler when title is missing', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: 'Tesla',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler when company is empty string', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: '',
          title: 'Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not call handler when title is whitespace only', async () => {
      const handler = vi.fn();
      cleanup = initExtensionMessageListener(handler);

      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: 'Tesla',
          title: '   ',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should return cleanup function that removes listener', async () => {
      const handler = vi.fn();
      const cleanupFn = initExtensionMessageListener(handler);

      expect(typeof cleanupFn).toBe('function');

      // Call cleanup
      cleanupFn();

      // Send message after cleanup
      const message = {
        type: 'JOB_DATA',
        source: 'job-tracker-extension',
        payload: {
          company: 'Tesla',
          title: 'Engineer',
        },
      };

      window.postMessage(message, '*');

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('sendAcknowledgment', () => {
    it('should post acknowledgment message', () => {
      const postMessageSpy = vi.spyOn(window, 'postMessage');

      sendAcknowledgment();

      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          type: 'JOB_DATA_RECEIVED',
          source: 'job-tracker-frontend',
        },
        window.location.origin,
      );

      postMessageSpy.mockRestore();
    });
  });
});
