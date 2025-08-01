/**
 * Utility to trigger user data synchronization across the app
 * Use this when user data is updated to avoid polling overhead
 */
export class UserDataSync {
  private static readonly EVENT_NAME = 'userDataUpdated' as const;

  /**
   * Trigger user data sync after profile updates, image uploads, etc.
   */
  static triggerSync(): void {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent(UserDataSync.EVENT_NAME));
      } catch (error) {
        console.warn('Failed to dispatch user data sync event:', error);
      }
    }
  }
}