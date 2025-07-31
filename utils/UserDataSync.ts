/**
 * Utility to trigger user data synchronization across the app
 * Use this when user data is updated to avoid polling overhead
 */
export class UserDataSync {
  /**
   * Trigger user data sync after profile updates, image uploads, etc.
   */
  static triggerSync() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userDataUpdated'));
    }
  }
}