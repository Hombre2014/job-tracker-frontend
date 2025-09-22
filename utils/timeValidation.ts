/**
 * Time validation utilities for TimeString branded type
 */

export type TimeString = string & { __brand: 'time' };

/**
 * Validates if a string is in valid HH:MM format (00:00-23:59)
 * @param str - String to validate
 * @returns true if valid time format
 *
 * @example
 * isValidTimeString('09:00') // true
 * isValidTimeString('23:59') // true
 * isValidTimeString('24:00') // false
 * isValidTimeString('99:99') // false
 */
export function isValidTimeString(str: string): str is TimeString {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
}

/**
 * Creates a validated TimeString from a string
 * @param str - Time string in HH:MM format
 * @returns Validated TimeString
 * @throws Error if invalid format
 *
 * @example
 * createTimeString('09:00') // Returns TimeString '09:00'
 * createTimeString('99:99') // Throws Error: Invalid time format
 */
export function createTimeString(str: string): TimeString {
  if (!isValidTimeString(str)) {
    throw new Error(
      `Invalid time format: "${str}". Expected HH:MM format (00:00-23:59)`
    );
  }
  return str;
}

/**
 * Safely creates a TimeString with fallback to default
 * @param str - Time string to validate
 * @param defaultTime - Fallback time if validation fails
 * @returns Valid TimeString
 *
 * @example
 * safeCreateTimeString('09:00') // Returns TimeString '09:00'
 * safeCreateTimeString('99:99') // Returns TimeString '09:00' (fallback)
 * safeCreateTimeString('99:99', '12:00') // Returns TimeString '12:00' (custom fallback)
 */
export function safeCreateTimeString(
  str: string,
  defaultTime: string = '09:00'
): TimeString {
  try {
    return createTimeString(str);
  } catch {
    return createTimeString(defaultTime);
  }
}
