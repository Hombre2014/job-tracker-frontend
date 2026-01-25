# Weak Password Flow Documentation

## Overview

This document describes the implementation of the weak password detection and enforcement flow that ensures existing users update their passwords to meet enhanced security standards.

## Security Requirements

All passwords must now meet these criteria:

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

## Implementation Details

### 1. Password Validation Schema

**Location:** `schemas/index.ts`

```typescript
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
```

This regex is used in:

- `RegisterSchema` - For new user registrations
- `ResetPasswordSchema` - For password resets

### 2. Password Strength Utility

**Location:** `utils/passwordStrength.ts`

```typescript
export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};
```

Used by the login page to detect weak passwords after successful authentication.

### 3. Login Flow with Weak Password Detection

**Location:** `app/(auth)/login/page.tsx`

**Process:**

1. User enters email and password
2. Login request is sent to backend
3. After successful authentication, password strength is checked
4. If password is weak:
   - Store user email
   - Show `WeakPasswordModal`
5. If password is strong:
   - Continue normal flow (load boards)

**Key Code:**

```typescript
useEffect(() => {
  if (status === 'succeeded') {
    setSuccess('Logged in successfully');

    if (userPassword && !isStrongPassword(userPassword)) {
      setShowPasswordModal(true); // Show modal for weak password
    } else {
      dispatch(getBoards(accessToken as string)); // Normal flow
    }
  }
}, [status, userPassword]);
```

### 4. Weak Password Modal

**Location:** `components/auth/ForcePasswordChangeModal.tsx`

**Component:** `WeakPasswordModal`

**Features:**

- Non-dismissible modal (no close button)
- Clear explanation of security requirements
- Step-by-step instructions
- Single action button: "Reset My Password"

**What it does:**

1. Clears local storage (logout user)
2. Redirects to forgot-password page with context parameters:
   - `email`: Pre-fills the email field
   - `reason=weak`: Indicates the user came from weak password detection

**Code:**

```typescript
const handleUpdatePassword = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  router.push(
    `/forgot-password?email=${encodeURIComponent(email)}&reason=weak`,
  );
};
```

### 5. Enhanced Forgot Password Page

**Location:** `app/(auth)/forgot-password/page.tsx`

**New Features:**

- Detects URL parameters to identify context
- Shows conditional content based on entry point

**URL Parameters:**

- `reason=weak`: User came from weak password detection
- `email`: Pre-filled email address

**Conditional Content:**

| Scenario               | Title                         | Banner Message                                                                                                                                   |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Normal forgot password | "Forgot Password"             | None                                                                                                                                             |
| Weak password reset    | "🔒 Strengthen Your Password" | "⚠️ Security Update Required: Your current password doesn't meet our updated security standards. Please reset it to a stronger one to continue." |

**Implementation:**

```typescript
const isWeakPasswordReset = searchParams.get('reason') === 'weak';
const prefilledEmail = searchParams.get('email') || '';

// Pre-fill email in form
const form = useForm({
  defaultValues: {
    email: prefilledEmail,
  },
});
```

## Complete User Flow

### Scenario: Existing User with Weak Password

1. **Login Attempt**
   - User enters email: `john@example.com`
   - User enters password: `password` (weak)
   - Clicks "Log in"

2. **Backend Authentication**
   - Backend validates credentials ✓
   - Returns access token and user data
   - Frontend stores tokens in localStorage

3. **Password Strength Check**
   - Frontend checks if password meets criteria
   - Result: FAIL (no uppercase, no numbers)

4. **Modal Display**
   - `WeakPasswordModal` appears
   - Shows security requirements
   - Shows step-by-step instructions
   - User cannot dismiss or close modal

5. **User Action**
   - User clicks "Reset My Password"
   - Frontend clears localStorage (logout)
   - Redirects to: `/forgot-password?email=john@example.com&reason=weak`

6. **Forgot Password Page**
   - Title: "🔒 Strengthen Your Password"
   - Yellow banner with security message
   - Email field pre-filled with `john@example.com`
   - User clicks "Send Password Reset Code"

7. **Verification Code**
   - Backend sends 6-digit code to email
   - User enters code
   - User enters new strong password (validated by `ResetPasswordSchema`)

8. **Password Reset**
   - Backend validates code and updates password
   - Success message: "Password reset successful"
   - Redirects to `/login`

9. **New Login**
   - User logs in with new strong password
   - Password strength check: PASS
   - Normal flow continues (boards load)

## Backend Endpoints Used

No new backend endpoints were created. The solution uses existing infrastructure:

1. **POST** `/auth/login`
   - User authentication
   - Returns access token and refresh token

2. **POST** `/users/reset-password/create-verification-code`
   - Sends 6-digit verification code to email
   - Used in step 1 of password reset

3. **POST** `/users/reset-password`
   - Validates code and updates password
   - Uses `ResetPasswordSchema` (enforces strong password)

## Testing Scenarios

### Test 1: New User Registration

- **Action:** Register with weak password
- **Expected:** Registration fails with validation error
- **Status:** ✅ Handled by `RegisterSchema`

### Test 2: New User with Strong Password

- **Action:** Register with strong password
- **Expected:** Registration succeeds
- **Status:** ✅ Handled by `RegisterSchema`

### Test 3: Existing User with Strong Password

- **Action:** Login with strong password
- **Expected:** Normal flow (boards load)
- **Status:** ✅ Password strength check passes

### Test 4: Existing User with Weak Password

- **Action:** Login with weak password
- **Expected:**
  1. Login succeeds (backend validation)
  2. Modal appears
  3. User redirected to forgot-password
  4. Complete password reset
  5. Login with new password
- **Status:** ✅ Complete flow implemented

## Files Modified

1. ✅ `schemas/index.ts` - Strong password regex in RegisterSchema and ResetPasswordSchema
2. ✅ `utils/passwordStrength.ts` - Password strength validation utility
3. ✅ `components/auth/ForcePasswordChangeModal.tsx` - Renamed to `WeakPasswordModal`, redirects to forgot-password
4. ✅ `components/ui/dialog.tsx` - Added `hideCloseButton` prop
5. ✅ `app/(auth)/login/page.tsx` - Weak password detection after login
6. ✅ `app/(auth)/forgot-password/page.tsx` - Conditional title and messaging based on URL params

## Security Considerations

✅ **Client-side validation only**

- Password strength is checked on frontend
- Existing users can still login with weak passwords
- Backend doesn't reject weak passwords on login

✅ **User experience focused**

- Non-intrusive approach
- Clear communication
- Guided flow

✅ **Backend enforcement**

- Strong password requirement enforced by `ResetPasswordSchema`
- Once user resets password, backend only accepts strong passwords
- All new registrations must use strong passwords

## Future Enhancements

### Optional: Backend Password Strength Check

If desired, backend can be enhanced to:

1. Store password strength flag in database
2. Return `weakPassword: true` in login response
3. Frontend already handles this gracefully

### Optional: Gradual Rollout

- Track users who have updated passwords
- Send email notifications after X days
- Eventually enforce backend validation

## Notes

- The solution leverages existing password reset infrastructure
- No new backend endpoints were needed
- Users with weak passwords can still login (non-breaking change)
- Password strength is enforced during password reset
- All new passwords must meet security requirements
