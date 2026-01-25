# Weak Password Flow - Testing Guide

## Test Environment Setup

### Prerequisites
- Frontend running: `npm run dev`
- Backend running with existing user data
- Email service configured (for verification codes)
- Browser with DevTools open

### Test Data Required

**Existing User with Weak Password:**
- Email: `weak@test.com`
- Password: `password` (weak - missing uppercase and numbers)

**Existing User with Strong Password:**
- Email: `strong@test.com`
- Password: `Password123` (strong ✓)

**New Test User:**
- Email: `newuser@test.com`
- Password: (will be tested with weak and strong)

---

## Test Case 1: New User Registration with Weak Password

### Expected Behavior
Registration should fail with validation error.

### Steps
1. Navigate to `/signup`
2. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `newuser@test.com`
   - Password: `password` (weak)
3. Click "Sign up"

### ✅ Expected Result
- Form shows validation error
- Error message: "Password must contain at least 1 uppercase, 1 lowercase, and 1 number"
- Registration is blocked

### ❌ Failure Indicators
- Form submits successfully
- No validation error shown
- User is created with weak password

---

## Test Case 2: New User Registration with Strong Password

### Expected Behavior
Registration should succeed.

### Steps
1. Navigate to `/signup`
2. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `newuser@test.com`
   - Password: `Password123` (strong)
3. Click "Sign up"

### ✅ Expected Result
- Form submits successfully
- Redirected to email verification page
- Verification code sent to email

### ❌ Failure Indicators
- Validation error shown
- Registration blocked

---

## Test Case 3: Login with Strong Password (Normal Flow)

### Expected Behavior
User logs in normally, no modal appears.

### Steps
1. Navigate to `/login`
2. Enter credentials:
   - Email: `strong@test.com`
   - Password: `Password123`
3. Click "Log in"

### ✅ Expected Result
- Login succeeds
- Success message: "Logged in successfully"
- Loader appears: "Loading user's data..."
- Redirected to `/home/boards` or `/home/boards/:id/board`
- **No modal appears**

### ❌ Failure Indicators
- WeakPasswordModal appears
- Redirected to forgot-password
- Login fails

---

## Test Case 4: Login with Weak Password (Main Flow)

### Expected Behavior
User sees modal and is guided through password reset.

### Steps

#### Part 1: Login & Modal
1. Navigate to `/login`
2. Enter credentials:
   - Email: `weak@test.com`
   - Password: `password`
3. Click "Log in"

### ✅ Expected Result (Part 1)
- Login succeeds with backend
- Success message: "Logged in successfully"
- **WeakPasswordModal appears** with:
  - Title: "🔒 Password Security Update Required"
  - Yellow box: Security requirements (8 chars, uppercase, lowercase, number)
  - Blue box: Step-by-step instructions
  - Email shown: `weak@test.com`
  - Button: "Reset My Password"
  - **Modal cannot be closed** (no X button, no backdrop click)

#### Part 2: Redirect
4. Click "Reset My Password" button

### ✅ Expected Result (Part 2)
- Modal closes
- Redirected to: `/forgot-password?email=weak@test.com&reason=weak`
- **Check DevTools → Application → Local Storage:**
  - `accessToken` should be **cleared**
  - `refreshToken` should be **cleared**
  - `user` should be **cleared**

#### Part 3: Forgot Password Page
5. Verify page content

### ✅ Expected Result (Part 3)
- Title: "🔒 Strengthen Your Password" (not "Forgot Password")
- Yellow banner with:
  - "⚠️ Security Update Required"
  - "Your current password doesn't meet our updated security standards. Please reset it to a stronger one to continue."
- Email field pre-filled with: `weak@test.com`
- Subtitle: "We'll send a verification code to your email"
- Button: "Send Password Reset Code"

#### Part 4: Send Verification Code
6. Click "Send Password Reset Code"

### ✅ Expected Result (Part 4)
- Request sent to: `/users/reset-password/create-verification-code`
- Success response
- Form switches to verification code form
- Email sent with 6-digit code

#### Part 5: Enter Code & New Password
7. Check email and copy 6-digit code
8. Enter in form:
   - Code: `123456` (from email)
   - New Password: `Password123`
9. Click "Reset Password"

### ✅ Expected Result (Part 5)
- Request sent to: `/users/reset-password`
- Body: `{ email: "weak@test.com", code: "123456", newPassword: "Password123" }`
- Success message: "Password reset successful"
- Redirected to: `/login`

#### Part 6: Login with New Password
10. Enter credentials:
    - Email: `weak@test.com`
    - Password: `Password123`
11. Click "Log in"

### ✅ Expected Result (Part 6)
- Login succeeds
- Success message: "Logged in successfully"
- Password strength check: **PASSES**
- **No modal appears**
- Loader: "Loading user's data..."
- Redirected to boards
- Normal flow continues

---

## Test Case 5: Weak Password - Try Weak Password Again

### Expected Behavior
ResetPasswordSchema should reject weak passwords.

### Steps
1. Complete Test Case 4 up to Part 5
2. Enter in form:
   - Code: `123456`
   - New Password: `password` (weak)
3. Click "Reset Password"

### ✅ Expected Result
- Form validation error appears
- Error message: "Password must contain at least 1 uppercase, 1 lowercase, and 1 number"
- Password reset is **blocked**
- Form does not submit

### ❌ Failure Indicators
- Form submits successfully
- Weak password is accepted
- User can login with weak password

---

## Test Case 6: Normal Forgot Password Flow (Not from Weak Password)

### Expected Behavior
Forgot password page should work normally without weak password messaging.

### Steps
1. Navigate to `/login`
2. Click "Forgot your password?" link
3. Verify page content

### ✅ Expected Result
- URL: `/forgot-password` (no query params)
- Title: "Forgot Password" (not "Strengthen Your Password")
- **No yellow security banner**
- Email field is **empty** (not pre-filled)
- Subtitle: "Enter your email"
- Button: "Send Password Reset Code"

### ❌ Failure Indicators
- Yellow security banner appears
- Title shows "Strengthen Your Password"
- Email is pre-filled

---

## Test Case 7: Modal Cannot Be Dismissed

### Expected Behavior
WeakPasswordModal should be truly non-dismissible.

### Steps
1. Complete Test Case 4 Part 1 (modal appears)
2. Try to dismiss modal by:
   - Looking for X close button (shouldn't exist)
   - Clicking outside modal (on backdrop)
   - Pressing ESC key
   - Clicking browser back button

### ✅ Expected Result
- No X close button visible
- Clicking backdrop does nothing
- ESC key does nothing
- Modal stays visible
- Only way to proceed is clicking "Reset My Password"

### ❌ Failure Indicators
- X close button visible
- Modal can be closed
- User can bypass password update

---

## Test Case 8: URL Parameters Validation

### Expected Behavior
Page should handle URL params correctly.

### Steps & Results

#### Test 8a: With reason=weak
```
URL: /forgot-password?reason=weak&email=test@test.com
Expected: 
  - Title: "🔒 Strengthen Your Password"
  - Yellow banner visible
  - Email pre-filled: test@test.com
```

#### Test 8b: With email only
```
URL: /forgot-password?email=test@test.com
Expected:
  - Title: "Forgot Password"
  - No yellow banner
  - Email pre-filled: test@test.com
```

#### Test 8c: With reason=weak but no email
```
URL: /forgot-password?reason=weak
Expected:
  - Title: "🔒 Strengthen Your Password"
  - Yellow banner visible
  - Email field empty
```

#### Test 8d: No parameters (normal)
```
URL: /forgot-password
Expected:
  - Title: "Forgot Password"
  - No yellow banner
  - Email field empty
```

---

## Test Case 9: Browser Console - No Errors

### Expected Behavior
No console errors during the entire flow.

### Steps
1. Open DevTools → Console
2. Execute Test Case 4 (complete weak password flow)
3. Monitor console throughout

### ✅ Expected Result
- No red errors in console
- API calls succeed (200, 201 status codes)
- No TypeScript errors
- No React warnings

### ❌ Failure Indicators
- Console errors
- Failed API calls
- TypeScript type errors
- React hydration errors

---

## Test Case 10: Network Inspection

### Expected Behavior
Verify correct API calls and data flow.

### Steps
1. Open DevTools → Network tab
2. Execute Test Case 4
3. Monitor network requests

### ✅ Expected Result

**On Login with Weak Password:**
```
POST /auth/login
Status: 200 OK
Response: { accessToken: "...", refreshToken: "...", user: {...} }
```

**On "Reset My Password" Click:**
```
No network call (just redirect)
```

**On "Send Password Reset Code":**
```
POST /users/reset-password/create-verification-code
Status: 200 OK
Body: { email: "weak@test.com" }
```

**On "Reset Password":**
```
POST /users/reset-password
Status: 201 Created
Body: { email: "weak@test.com", code: "123456", newPassword: "Password123" }
```

**On Login with New Password:**
```
POST /auth/login
Status: 200 OK
Response: { accessToken: "...", refreshToken: "...", user: {...} }
```

**On Successful Login:**
```
GET /boards (or similar)
Status: 200 OK
```

---

## Test Case 11: Multiple Users - Session Isolation

### Expected Behavior
Different users should have isolated sessions.

### Steps
1. Open browser window 1: Login with `weak@test.com` → Modal appears
2. Open browser window 2 (incognito): Login with `strong@test.com` → Normal flow
3. In window 1: Complete password reset
4. In window 2: Verify still logged in

### ✅ Expected Result
- Window 1: Goes through password reset flow
- Window 2: Stays logged in, not affected
- Sessions are completely isolated

---

## Test Case 12: Password Strength Edge Cases

### Password Test Matrix

| Password | Expected Result | Reason |
|----------|----------------|--------|
| `pass` | ❌ REJECT | Too short (< 8 chars) |
| `password` | ❌ REJECT | No uppercase, no number |
| `PASSWORD` | ❌ REJECT | No lowercase, no number |
| `Password` | ❌ REJECT | No number |
| `password1` | ❌ REJECT | No uppercase |
| `PASSWORD1` | ❌ REJECT | No lowercase |
| `Pass1` | ❌ REJECT | Too short (< 8 chars) |
| `Password1` | ✅ ACCEPT | 9 chars, has upper, lower, number |
| `Password123` | ✅ ACCEPT | Strong |
| `MyPass99` | ✅ ACCEPT | Strong |
| `Abcd1234` | ✅ ACCEPT | Strong |
| `Test@123` | ✅ ACCEPT | Strong (special char OK) |

### Test Each Password
1. Try registering new user with each password
2. Try resetting password to each password
3. Verify expected behavior

---

## Regression Testing Checklist

Ensure these existing features still work:

### ✅ Login
- [ ] Normal login with strong password works
- [ ] Login with invalid credentials shows error
- [ ] "Forgot password?" link works

### ✅ Registration
- [ ] New user registration works
- [ ] Email validation works
- [ ] Password validation works
- [ ] Redirect to email verification works

### ✅ Forgot Password (Normal Flow)
- [ ] Can request password reset code
- [ ] Verification code is received
- [ ] Can reset password with valid code
- [ ] Can login with new password

### ✅ Email Verification
- [ ] Email verification still works
- [ ] Verification code validation works

---

## Debugging Guide

### If Modal Doesn't Appear
1. Check: Is password actually weak?
   ```javascript
   // In browser console
   const password = "password";
   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   console.log(regex.test(password)); // Should be false for weak passwords
   ```

2. Check: Login status
   ```javascript
   // In Redux DevTools
   // state.user.status should be 'succeeded'
   ```

3. Check: userPassword state
   ```javascript
   // In React DevTools
   // LoginPage → userPassword should have the password value
   ```

### If Redirect Doesn't Work
1. Check: localStorage is cleared
   ```javascript
   // In browser DevTools → Application → Local Storage
   // Should see accessToken, refreshToken, user all removed
   ```

2. Check: URL contains params
   ```
   Should be: /forgot-password?email=...&reason=weak
   Not: /forgot-password
   ```

### If Conditional Content Doesn't Show
1. Check: URL params are read correctly
   ```javascript
   // In browser console on forgot-password page
   const params = new URLSearchParams(window.location.search);
   console.log(params.get('reason')); // Should be 'weak'
   console.log(params.get('email')); // Should be user email
   ```

2. Check: isWeakPasswordReset variable
   ```javascript
   // In React DevTools
   // ForgotPassword component → isWeakPasswordReset should be true
   ```

---

## Performance Testing

### Load Time
- [ ] Modal renders instantly after login
- [ ] No delay or flicker
- [ ] Page transitions are smooth

### Memory Leaks
1. Open DevTools → Performance → Memory
2. Execute Test Case 4 multiple times
3. Take heap snapshots before and after
4. Verify no significant memory increase

---

## Accessibility Testing

### Keyboard Navigation
1. Tab through modal elements
2. Enter key should activate "Reset My Password"
3. Focus should be trapped in modal

### Screen Reader
1. Use NVDA/JAWS
2. Verify all text is read correctly
3. Verify button roles are announced

---

## Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Mobile Testing

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive design
- [ ] Touch interactions work

---

## Summary Checklist

Before marking as complete, verify:

- [ ] All 12 test cases pass
- [ ] No console errors
- [ ] Network calls are correct
- [ ] Regression tests pass
- [ ] Cross-browser compatibility
- [ ] Mobile compatibility
- [ ] Accessibility standards met
- [ ] Performance is acceptable
- [ ] Documentation is updated
